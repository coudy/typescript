///<reference path='References.ts' />

class ScannerTokenInfo {
    public Kind: SyntaxKind;
    public KeywordKind: SyntaxKind;
    public Text: string;
}

class ScannerTriviaInfo {
    public Width: number;
    public HasComment: bool;
    public HasNewLine: bool;
}

class Scanner extends SlidingWindow {
    private text: IText = null;
    private errors: SyntaxDiagnosticInfo[] = [];
    private stringTable: StringTable;
    private languageVersion: LanguageVersion;

    private static isKeywordStartCharacter: bool[] = [];
    private static isIdentifierStartCharacter: bool[] = [];
    private static isIdentifierPartCharacter: bool[] = [];
    private static MaxAsciiCharacter = 127;

    private static initializeStaticData() {
        if (Scanner.isKeywordStartCharacter.length === 0) {
            for (var character = 0; character < MaxAsciiCharacter; character++) {
                if (character >= CharacterCodes.a && character <= CharacterCodes.z) {
                    Scanner.isKeywordStartCharacter[character] = true;
                    Scanner.isIdentifierStartCharacter[character] = true;
                    Scanner.isIdentifierPartCharacter[character] = true;
                }
                else if ((character >= CharacterCodes.A && character <= CharacterCodes.Z) ||
                         character === CharacterCodes._ ||
                         character === CharacterCodes.$) {
                    Scanner.isIdentifierStartCharacter[character] = true;
                    Scanner.isIdentifierPartCharacter[character] = true;
                }
                else if (character >= CharacterCodes._0 && character <= CharacterCodes._9) {
                    Scanner.isIdentifierPartCharacter[character] = true;
                }
            }
        }
    }

    public static create(text: IText, languageVersion: LanguageVersion): Scanner {
        return new Scanner(text, languageVersion, new StringTable());
    }

    constructor(text: IText, languageVersion: LanguageVersion, stringTable: StringTable) {
        super(2048, 0, text.length());
        Scanner.initializeStaticData();

        this.text = text;
        this.stringTable = stringTable;
        this.languageVersion = languageVersion;
    }

    private fetchMoreItems(sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    }

    private addSimpleDiagnosticInfo(code: DiagnosticCode, ...args: any[]): void {
        this.addDiagnosticInfo(this.makeSimpleDiagnosticInfo(code, args));
    }

    private addDiagnosticInfo(error: SyntaxDiagnosticInfo): void {
        if (this.errors === null) {
            this.errors = [];
        }

        this.errors.push(error);
    }

    private makeSimpleDiagnosticInfo(code: DiagnosticCode, args: any[]): SyntaxDiagnosticInfo {
        return SyntaxDiagnosticInfo.create(code, args);
    }

    private previousTokenKind: SyntaxKind = SyntaxKind.None;
    private previousTokenKeywordKind: SyntaxKind = SyntaxKind.None;
    private tokenInfo: ScannerTokenInfo = new ScannerTokenInfo();
    private leadingTriviaInfo = new ScannerTriviaInfo();
    private trailingTriviaInfo = new ScannerTriviaInfo();

    public scan(): ISyntaxToken {
        if (this.errors.length > 0) {
            this.errors = [];
        }

        var start = this.absoluteIndex();
        this.scanTriviaInfo(/*afterFirstToken: */ this.absoluteIndex() > 0, /*isTrailing: */ false, this.leadingTriviaInfo);
        this.scanSyntaxToken();
        this.scanTriviaInfo(/* afterFirstToken: */ true, /*isTrailing: */true, this.trailingTriviaInfo);

        this.previousTokenKind = this.tokenInfo.Kind;
        this.previousTokenKeywordKind = this.tokenInfo.KeywordKind;
        return this.createToken(start);
    }

    private createToken(start: number): ISyntaxToken {
        return SyntaxTokenFactory.create(start, this.leadingTriviaInfo, this.tokenInfo, this.trailingTriviaInfo,
            this.errors.length === 0 ? null : this.errors);
    }

    private scanTriviaInfo(afterFirstToken: bool, isTrailing: bool, triviaInfo: ScannerTriviaInfo): void {
        triviaInfo.Width = 0;
        triviaInfo.HasComment = false;
        triviaInfo.HasNewLine = false;

        while (true) {
            var ch = this.currentItem();

            switch (ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark:
                    this.moveToNextItem();
                    triviaInfo.Width++;
                    continue;
            }

            // TODO: Handle unicode space characters.
            if (ch === CharacterCodes.slash) {
                var ch2 = this.peekItemN(1);
                if (ch2 === CharacterCodes.slash) {
                    this.moveToNextItem();
                    this.moveToNextItem();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;

                    this.scanSingleLineCommentTrivia(triviaInfo);
                    continue;
                }

                if (ch2 === CharacterCodes.asterisk) {
                    this.moveToNextItem();
                    this.moveToNextItem();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;

                    this.scanMultiLineCommentTrivia(triviaInfo);
                    continue;
                }

                return;
            }

            if (this.isNewLineCharacter(ch)) {
                triviaInfo.HasNewLine = true;

                if (ch === CharacterCodes.carriageReturn) {
                    this.moveToNextItem();
                    triviaInfo.Width++;
                }

                ch = this.currentItem();
                if (ch === CharacterCodes.newLine) {
                    this.moveToNextItem();
                    triviaInfo.Width++;
                }

                if (isTrailing) {
                    return;
                }

                continue;
            }

            return;
        }
    }

    private isNewLineCharacter(ch: number): bool {
        switch (ch) {
            case CharacterCodes.carriageReturn:
            case CharacterCodes.newLine:
            case CharacterCodes.paragraphSeparator:
            case CharacterCodes.lineSeparator:
                return true;
            default:
                return false;
        }
    }

    private scanSingleLineCommentTrivia(triviaInfo: ScannerTriviaInfo): void {
        while (true) {
            var ch = this.currentItem();
            if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                return;
            }

            this.moveToNextItem();
            triviaInfo.Width++;
        }
    }

    private scanMultiLineCommentTrivia(triviaInfo: ScannerTriviaInfo): void {
        while (true) {
            var ch = this.currentItem();
            if (ch === CharacterCodes.nullCharacter) {
                return;
            }

            if (ch === CharacterCodes.asterisk && this.peekItemN(1) === CharacterCodes.slash) {
                this.moveToNextItem();
                this.moveToNextItem();
                triviaInfo.Width += 2;
                return;
            }

            this.moveToNextItem();
            triviaInfo.Width++;
        }
    }

    private scanSyntaxToken(): void {
        this.tokenInfo.Kind = SyntaxKind.None;
        this.tokenInfo.KeywordKind = SyntaxKind.None;
        this.tokenInfo.Text = null;

        var character = this.currentItem();

        switch (character) {
            case CharacterCodes.doubleQuote:
            case CharacterCodes.singleQuote:
                this.scanStringLiteral();
                return;

            // These are the set of variable width punctuation tokens.
            case CharacterCodes.slash:
                this.scanSlashToken();
                return;

            case CharacterCodes.dot:
                this.scanDotToken();
                return;

            case CharacterCodes.minus:
                this.scanMinusToken();
                return;

            case CharacterCodes.exclamation:
                this.scanExclamationToken();
                return;

            case CharacterCodes.equals:
                this.scanEqualsToken();
                return;

            case CharacterCodes.bar:
                this.scanBarToken();
                return;

            case CharacterCodes.asterisk:
                this.scanAsteriskToken();
                return;

            case CharacterCodes.plus:
                this.scanPlusToken();
                return;

            case CharacterCodes.percent:
                this.scanPercentToken();
                return;

            case CharacterCodes.ampersand:
                this.scanAmpersandToken();
                return;

            case CharacterCodes.caret:
                this.scanCaretToken();
                return;

            case CharacterCodes.lessThan:
                this.scanLessThanToken();
                return;

            case CharacterCodes.greaterThan:
                this.scanGreaterThanToken();
                return;

            // These are the set of fixed, single character length punctuation tokens.
            // The token kind does not depend on what follows.
            case CharacterCodes.comma:
                this.advanceAndSetTokenKind(SyntaxKind.CommaToken);
                return;

            case CharacterCodes.colon:
                this.advanceAndSetTokenKind(SyntaxKind.ColonToken);
                return;

            case CharacterCodes.semicolon:
                this.advanceAndSetTokenKind(SyntaxKind.SemicolonToken);
                return;

            case CharacterCodes.tilde:
                this.advanceAndSetTokenKind(SyntaxKind.TildeToken);
                return;

            case CharacterCodes.openParen:
                this.advanceAndSetTokenKind(SyntaxKind.OpenParenToken);
                return;

            case CharacterCodes.closeParen:
                this.advanceAndSetTokenKind(SyntaxKind.CloseParenToken);
                return;

            case CharacterCodes.openBrace:
                this.advanceAndSetTokenKind(SyntaxKind.OpenBraceToken);
                return;

            case CharacterCodes.closeBrace:
                this.advanceAndSetTokenKind(SyntaxKind.CloseBraceToken);
                return;

            case CharacterCodes.openBracket:
                this.advanceAndSetTokenKind(SyntaxKind.OpenBracketToken);
                return;

            case CharacterCodes.closeBracket:
                this.advanceAndSetTokenKind(SyntaxKind.CloseBracketToken);
                return;

            case CharacterCodes.question:
                this.advanceAndSetTokenKind(SyntaxKind.QuestionToken);
                return;

            case CharacterCodes.nullCharacter:
                // If we see a null character, we're done.
                this.tokenInfo.Kind = SyntaxKind.EndOfFileToken;
                this.tokenInfo.Text = "";
                return;
        }

        if (Scanner.isKeywordStartCharacter[character]) {
            this.scanIdentifierOrKeyword();
            return;
        }

        if (this.isNumericLiteralStart(character)) {
            this.scanNumericLiteral();
            return;
        }

        if (this.isIdentifierStart(this.peekCharOrUnicodeEscape())) {
            this.scanIdentifier();
            return;
        }

        this.scanDefaultCharacter(character);
    }

    private isIdentifierStart(interpretedChar: number): bool {
        if (Scanner.isIdentifierStartCharacter[interpretedChar]) {
            return true;
        }

        return interpretedChar > Scanner.MaxAsciiCharacter && Unicode.isIdentifierStart(interpretedChar, this.languageVersion);
    }

    private isIdentifierPart(interpretedChar: number): bool {
        if (Scanner.isIdentifierPartCharacter[interpretedChar]) {
            return true;
        }

        return interpretedChar > Scanner.MaxAsciiCharacter && Unicode.isIdentifierPart(interpretedChar, this.languageVersion);
    }

    private scanIdentifier(): void {
        var startIndex = this.getAndPinAbsoluteIndex();

        do {
            this.scanCharOrUnicodeEscape(this.errors);
        }
        while (this.isIdentifierPart(this.peekCharOrUnicodeEscape()));

        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, /*intern:*/ true);
        this.tokenInfo.Kind = SyntaxKind.IdentifierNameToken;

        this.releaseAndUnpinAbsoluteIndex(startIndex);
    }

    private scanNumericLiteral(): void {
        // Because we'll be pulling out the text of the numeric literal and storing it in the token
        // we need to pin the underling sliding window.
        var startIndex = this.getAndPinAbsoluteIndex();

        if (this.isHexNumericLiteral()) {
            this.scanHexNumericLiteral(startIndex);
        }
        else {
            this.scanDecimalNumericLiteral(startIndex);
        }

        this.releaseAndUnpinAbsoluteIndex(startIndex);
    }

    private scanDecimalNumericLiteral(startIndex: number): void {
        while (CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }

        if (this.currentItem() === CharacterCodes.dot) {
            this.moveToNextItem();
        }

        while (CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }

        var ch = this.currentItem();
        if (ch === CharacterCodes.e || ch === CharacterCodes.E) {
            this.moveToNextItem();

            ch = this.currentItem();
            if (ch === CharacterCodes.minus || ch === CharacterCodes.plus) {
                if (CharacterInfo.isDecimalDigit(this.peekItemN(1))) {
                    this.moveToNextItem();
                }
            }
        }

        while (CharacterInfo.isDecimalDigit(this.currentItem())) {
            this.moveToNextItem();
        }

        var endIndex = this.absoluteIndex();

        this.tokenInfo.Text = this.substring(startIndex, endIndex, /*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private scanHexNumericLiteral(start: number): void {
        Debug.assert(this.isHexNumericLiteral());
        this.moveToNextItem();
        this.moveToNextItem();

        while (CharacterInfo.isHexDigit(this.currentItem())) {
            this.moveToNextItem();
        }

        var end = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(start, end, /*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private isHexNumericLiteral(): bool {
        if (this.currentItem() === CharacterCodes._0) {
            var ch = this.peekItemN(1);
            return ch === CharacterCodes.x || ch === CharacterCodes.X;
        }

        return false;
    }

    private isNumericLiteralStart(ch: number): bool {
        if (CharacterInfo.isDecimalDigit(ch)) {
            return true;
        }

        return this.isDotPrefixedNumericLiteral();
    }

    private scanIdentifierOrKeyword(): void {
        this.scanIdentifier();

        var kind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
        if (kind !== SyntaxKind.None) {
            this.tokenInfo.KeywordKind = kind;
        }
    }

    private advanceAndSetTokenKind(kind: SyntaxKind): void {
        this.moveToNextItem();
        this.tokenInfo.Kind = kind;
    }

    private scanGreaterThanToken(): void {
        // NOTE(cyrusn): If we want to support generics, we will likely have to stop lexing
        // the >> and >>> constructs here and instead construct those in the parser.
        this.moveToNextItem();
        var character = this.currentItem();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanToken();
        } else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanToken(): void {
        this.moveToNextItem();
        var character = this.currentItem();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanGreaterThanToken();
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanGreaterThanToken(): void {
        this.moveToNextItem();
        var character = this.currentItem();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
        }
    }

    private scanLessThanToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.LessThanEqualsToken;
        }
        else if (this.currentItem() === CharacterCodes.lessThan) {
            this.moveToNextItem();
            if (this.currentItem() === CharacterCodes.equals) {
                this.moveToNextItem();
                this.tokenInfo.Kind = SyntaxKind.LessThanLessThanEqualsToken;
            }
            else {
                this.tokenInfo.Kind = SyntaxKind.LessThanLessThanToken;
            }
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.LessThanToken;
        }
    }

    private scanBarToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarEqualsToken;
        }
        else if (this.currentItem() === CharacterCodes.bar) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarBarToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.BarToken;
        }
    }

    private scanCaretToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.CaretEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.CaretToken;
        }
    }

    private scanAmpersandToken(): void {
        this.moveToNextItem();
        var character = this.currentItem();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandEqualsToken;
        }
        else if (this.currentItem() === CharacterCodes.ampersand) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandAmpersandToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AmpersandToken;
        }
    }

    private scanPercentToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PercentEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PercentToken;
        }
    }

    private scanMinusToken(): void {
        this.moveToNextItem();
        var character = this.currentItem();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.MinusEqualsToken;
        }
        else if (character === CharacterCodes.minus) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.MinusMinusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.MinusToken;
        }
    }

    private scanPlusToken(): void {
        this.moveToNextItem();
        var character = this.currentItem();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PlusEqualsToken;
        }
        else if (character === CharacterCodes.plus) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PlusPlusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PlusToken;
        }
    }

    private scanAsteriskToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AsteriskEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AsteriskToken;
        }
    }

    private scanEqualsToken(): void {
        this.moveToNextItem();
        var character = this.currentItem()
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();

            if (this.currentItem() === CharacterCodes.equals) {
                this.moveToNextItem();

                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsEqualsToken;
            }
            else {
                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsToken;
            }
        }
        else if (character === CharacterCodes.greaterThan) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.EqualsGreaterThanToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.EqualsToken;
        }
    }

    private isDotPrefixedNumericLiteral(): bool {
        if (this.currentItem() === CharacterCodes.dot) {
            var ch = this.peekItemN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }

        return false;
    }

    private scanDotToken(): void {
        if (this.isDotPrefixedNumericLiteral()) {
            this.scanNumericLiteral();
            return;
        }

        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.dot &&
            this.peekItemN(1) === CharacterCodes.dot) {

            this.moveToNextItem();
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.DotDotDotToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.DotToken;
        }
    }

    private scanSlashToken(): void {
        if (this.tryScanRegularExpressionToken()) {
            return;
        }

        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.SlashEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.SlashToken;
        }
    }

    private tryScanRegularExpressionToken(): bool {
        switch (this.previousTokenKind) {
            case SyntaxKind.IdentifierNameToken:
                if (this.previousTokenKeywordKind === SyntaxKind.None) {
                    return false;
                }
                break;

            case SyntaxKind.StringLiteral:
            case SyntaxKind.RegularExpressionLiteral:
            case SyntaxKind.ThisKeyword:
            case SyntaxKind.PlusPlusToken:
            case SyntaxKind.MinusMinusToken:
            case SyntaxKind.CloseParenToken:
            case SyntaxKind.CloseBracketToken:
            case SyntaxKind.CloseBraceToken:
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
                return false;
        }

        Debug.assert(this.currentItem() === CharacterCodes.slash);

        var startIndex = this.getAndPinAbsoluteIndex();
        try {
            this.moveToNextItem();

            var skipNextSlash = false;
            while (true) {
                var ch = this.currentItem();
                if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                    this.rewindToPinnedIndex(startIndex);
                    return false;
                }

                this.moveToNextItem();
                if (!skipNextSlash && ch === CharacterCodes.slash) {
                    break;
                }
                else if (!skipNextSlash && ch === CharacterCodes.backslash) {
                    skipNextSlash = true;
                    continue;
                }

                skipNextSlash = false;
            }

            // TODO: The grammar says any identifier part is allowed here.  Do we need to support
            // \u identifiers here?  The existing typescript parser does not.  
            while (Scanner.isIdentifierPartCharacter[this.currentItem()]) {
                this.moveToNextItem();
            }

            var endIndex = this.absoluteIndex();
            this.tokenInfo.Kind = SyntaxKind.RegularExpressionLiteral;
            this.tokenInfo.Text = this.substring(startIndex, endIndex, /*intern:*/ false);
            return true;
        }
        finally {
            this.releaseAndUnpinAbsoluteIndex(startIndex);
        }
    }

    private scanExclamationToken(): void {
        this.moveToNextItem();
        if (this.currentItem() === CharacterCodes.equals) {
            this.moveToNextItem();

            if (this.currentItem() === CharacterCodes.equals) {
                this.moveToNextItem();

                this.tokenInfo.Kind = SyntaxKind.ExclamationEqualsEqualsToken;
            }
            else {
                this.tokenInfo.Kind = SyntaxKind.ExclamationEqualsToken;
            }
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.ExclamationToken;
        }
    }

    private scanDefaultCharacter(character: number): void {
        this.moveToNextItem();
        this.tokenInfo.Text = String.fromCharCode(character);
        this.tokenInfo.Kind = SyntaxKind.ErrorToken;
        this.addSimpleDiagnosticInfo(DiagnosticCode.Unexpected_character_0, this.tokenInfo.Text);
    }

    private skipEscapeSequence(): void {
        Debug.assert(this.currentItem() === CharacterCodes.backslash);

        var rewindPoint = this.getRewindPoint();
        try {
        // Consume the backslash.
            this.moveToNextItem();

        // Get the char after the backslash
            var ch = this.currentItem();
            this.moveToNextItem();
            switch (ch) {
                case CharacterCodes.singleQuote:
                case CharacterCodes.doubleQuote:
                case CharacterCodes.backslash:
                    // value is ch itself;
                    return;

                case CharacterCodes._0:
                    // TODO: Deal with this part of the spec rule: 0 [lookahead ∉DecimalDigit]
                    // value is CharacterCodes.nullCharacter;
                    return;

                case CharacterCodes.b:
                    // value is CharacterCodes.backspace;
                    return;

                case CharacterCodes.f:
                    // value is CharacterCodes.formFeed;
                    return;

                case CharacterCodes.n:
                    // value is CharacterCodes.newLine;
                    return;

                case CharacterCodes.r:
                    // value is CharacterCodes.carriageReturn;
                    return;

                case CharacterCodes.t:
                    // value is CharacterCodes.tab;
                    return;

                case CharacterCodes.v:
                    // value is CharacterCodes.verticalTab;
                    return;

                case CharacterCodes.x:
                case CharacterCodes.u:
                    this.rewind(rewindPoint);
                    var value = this.scanUnicodeOrHexEscape(this.errors);
                    return;

                case CharacterCodes.carriageReturn:
                    // If it's \r\n then consume both characters.
                    if (this.currentItem() === CharacterCodes.newLine) {
                        this.moveToNextItem();
                    }
                    return;
                case CharacterCodes.newLine:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    return;

                default:
                    // Any other character is ok as well.  As per rule:
                    // EscapeSequence :: CharacterEscapeSequence
                    // CharacterEscapeSequence :: NonEscapeCharacter
                    // NonEscapeCharacter :: SourceCharacter but notEscapeCharacter or LineTerminator
                    return;
            }
        }
        finally {
            this.releaseRewindPoint(rewindPoint);
        }
    }

    private scanStringLiteral(): void {
        var quoteCharacter = this.currentItem();

        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);

        var startIndex = this.getAndPinAbsoluteIndex();
        this.moveToNextItem();

        while (true) {
            var ch = this.currentItem();
            if (ch === CharacterCodes.backslash) {
                this.skipEscapeSequence();
            }
            else if (ch === quoteCharacter) {
                this.moveToNextItem();
                break;
            }
            else if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                this.addSimpleDiagnosticInfo(DiagnosticCode.Missing_closing_quote_character);
                break;
            }
            else {
                this.moveToNextItem();
            }
        }

        var endIndex = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(startIndex, endIndex, true);
        this.tokenInfo.Kind = SyntaxKind.StringLiteral;

        this.releaseAndUnpinAbsoluteIndex(startIndex);
    }

    private isUnicodeOrHexEscape(character: number): bool {
        return this.isUnicodeEscape(character) || this.isHexEscape(character);
    }

    private isUnicodeEscape(character: number): bool {
        if (character === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.u) {
                return true;
            }
        }

        return false;
    }

    private isHexEscape(character: number): bool {
        if (character === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.x) {
                return true;
            }
        }

        return false;
    }

    private peekCharOrUnicodeOrHexEscape(): number {
        var character = this.currentItem();
        if (this.isUnicodeOrHexEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return character;
        }
    }

    private peekCharOrUnicodeEscape(): number {
        var character = this.currentItem();
        if (this.isUnicodeEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return character;
        }
    }

    private peekUnicodeOrHexEscape(): number {
        var rewindPoint = this.getRewindPoint();

        // if we're peeking, then we don't want to change the position
        var ch = this.scanUnicodeOrHexEscape(/*errors:*/ null);
        this.rewind(rewindPoint);
        this.releaseRewindPoint(rewindPoint);
        return ch;
    }

    private scanCharOrUnicodeEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.currentItem();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.u) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.moveToNextItem();
        return ch;
    }

    private scanCharOrUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.currentItem();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.u || ch2 === CharacterCodes.x) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.moveToNextItem();
        return ch;
    }

    private scanUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var start = this.absoluteIndex();
        var character = this.currentItem();
        Debug.assert(character === CharacterCodes.backslash);
        this.moveToNextItem();

        character = this.currentItem();
        Debug.assert(character === CharacterCodes.u || character === CharacterCodes.x);

        var intChar = 0;
        this.moveToNextItem();

        var count = character === CharacterCodes.u ? 4 : 2;

        for (var i = 0; i < count; i++) {
            var ch2 = this.currentItem();
            if (!CharacterInfo.isHexDigit(ch2)) {
                if (errors !== null) {
                    var end = this.absoluteIndex();
                    var info = this.createIllegalEscapeDiagnostic(start, end);
                    errors.push(info);
                }

                break;
            }

            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.moveToNextItem();
        }

        return intChar;
    }

    private createIllegalEscapeDiagnostic(start: number, end: number): SyntaxDiagnosticInfo {
        return new SyntaxDiagnosticInfo(start, end - start,
            DiagnosticCode.Unrecognized_escape_sequence);
    }

    public substring(start: number, end: number, intern: bool): string {
        var length = end - start;
        var offset = start - this.windowAbsoluteStartIndex;
        if (intern) {
            return this.stringTable.addCharArray(this.window, offset, length);
        }
        else {
            return StringUtilities.fromCharCodeArray(this.window.slice(offset, offset + length));
        }
    }
}