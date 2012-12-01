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

class SlidingTextWindow extends SlidingWindow {
    private text: IText;
    private stringTable: StringTable;

    constructor(text: IText, stringTable: StringTable) {
        super(2048, 0);

        this.text = text;
        this.stringTable = stringTable;
    }

    //private storeAdditionalRewindState(rewindPoint: IRewindPoint): void {
    //    // Nothing additional to store.
    //}

    //private restoreStateFromRewindPoint(rewindPoint: IRewindPoint): void {
    //    // Nothing additional to restore.
    //}

    private isPastSourceEnd(): bool {
        return this.absoluteIndex() >= this.text.length();
    }

    private fetchMoreItems(sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    }

    public substring(start: number, end: number, intern: bool): string {
        return this.substr(start, end - start, intern);
    }

    public substr(start: number, length: number, intern: bool): string {
        var offset = start - this.windowAbsoluteStartIndex;
        if (intern) {
            return this.stringTable.addCharArray(this.window, offset, length);
        }
        else {
            return StringUtilities.fromCharCodeArray(this.window.slice(offset, offset + length));
        }
    }
}

class Scanner {
    private text: IText = null;
    private builder: number[] = [];
    private errors: SyntaxDiagnosticInfo[] = [];
    private textWindow: SlidingTextWindow = null;
    private languageVersion: LanguageVersion;

    public static create(text: IText, languageVersion: LanguageVersion): Scanner {
        return new Scanner(text, languageVersion, new StringTable());
    }

    constructor(text: IText, languageVersion: LanguageVersion, stringTable: StringTable) {
        Contract.throwIfNull(stringTable);

        this.text = text;
        this.textWindow = new SlidingTextWindow(text, stringTable);
        this.languageVersion = languageVersion;
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

        // Get a rewind point in the text window.  this will 'fix' it enabling us to extract any
        // text we need for a token.
        var rewindPoint = this.textWindow.getRewindPoint();
        try {
            var start = this.textWindow.absoluteIndex();
            this.scanTriviaInfo(/*afterFirstToken: */ this.textWindow.absoluteIndex() > 0, /*isTrailing: */ false, this.leadingTriviaInfo);
            this.scanSyntaxToken();
            this.scanTriviaInfo(/* afterFirstToken: */ true, /*isTrailing: */true, this.trailingTriviaInfo);

            this.previousTokenKind = this.tokenInfo.Kind;
            this.previousTokenKeywordKind = this.tokenInfo.KeywordKind;
            return this.createToken(start);
        }
        finally {
            this.textWindow.releaseRewindPoint(rewindPoint);
        }
    }

    private createToken(start: number): ISyntaxToken {
        return SyntaxTokenFactory.create(start, this.leadingTriviaInfo, this.tokenInfo, this.trailingTriviaInfo,
            this.errors.length == 0 ? null : this.errors);
    }

    private scanTriviaInfo(afterFirstToken: bool, isTrailing: bool, triviaInfo: ScannerTriviaInfo): void {
        triviaInfo.Width = 0;
        triviaInfo.HasComment = false;
        triviaInfo.HasNewLine = false;

        while (true) {
            var ch = this.textWindow.currentItem();

            switch (ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark:
                    this.textWindow.moveToNextItem();
                    triviaInfo.Width++;
                    continue;
            }

            // TODO: Handle unicode space characters.
            if (ch === CharacterCodes.slash) {
                var ch2 = this.textWindow.peekItemN(1);
                if (ch2 === CharacterCodes.slash) {
                    this.textWindow.moveToNextItem();
                    this.textWindow.moveToNextItem();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;

                    this.scanSingleLineCommentTrivia(triviaInfo);
                    continue;
                }

                if (ch2 === CharacterCodes.asterisk) {
                    this.textWindow.moveToNextItem();
                    this.textWindow.moveToNextItem();
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
                    this.textWindow.moveToNextItem();
                    triviaInfo.Width++;
                }

                ch = this.textWindow.currentItem();
                if (ch === CharacterCodes.newLine) {
                    this.textWindow.moveToNextItem();
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
            var ch = this.textWindow.currentItem();
            if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                return;
            }

            this.textWindow.moveToNextItem();
            triviaInfo.Width++;
        }
    }

    private scanMultiLineCommentTrivia(triviaInfo: ScannerTriviaInfo): void {
        while (true) {
            var ch = this.textWindow.currentItem();
            if (ch === CharacterCodes.nullCharacter) {
                return;
            }

            if (ch === CharacterCodes.asterisk && this.textWindow.peekItemN(1) === CharacterCodes.slash) {
                this.textWindow.moveToNextItem();
                this.textWindow.moveToNextItem();
                triviaInfo.Width += 2;
                return;
            }

            this.textWindow.moveToNextItem();
            triviaInfo.Width++;
        }
    }

    private scanSyntaxToken(): void {
        this.tokenInfo.Kind = SyntaxKind.None;
        this.tokenInfo.KeywordKind = SyntaxKind.None;
        this.tokenInfo.Text = null;

        var character = this.textWindow.currentItem();
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

        if (character >= CharacterCodes.a && character <= CharacterCodes.z) {
            this.scanIdentifierOrKeyword();
            return;
        }

        if (this.isIdentifierStart(character)) {
            this.scanIdentifier();
            return;
        }

        if (this.isNumericLiteralStart(character)) {
            this.scanNumericLiteral();
            return;
        }

        this.scanDefaultCharacter(character, /*isEscaped:*/ false);
    }

    private scanNumericLiteral(): void {
        if (this.isHexNumericLiteral()) {
            this.scanHexNumericLiteral();
        }
        else {
            this.scanDecimalNumericLiteral();
        }
    }

    private scanDecimalNumericLiteral(): void {
        var start = this.textWindow.absoluteIndex();

        while (CharacterInfo.isDecimalDigit(this.textWindow.currentItem())) {
            this.textWindow.moveToNextItem();
        }

        if (this.textWindow.currentItem() === CharacterCodes.dot) {
            this.textWindow.moveToNextItem();
        }

        while (CharacterInfo.isDecimalDigit(this.textWindow.currentItem())) {
            this.textWindow.moveToNextItem();
        }

        var ch = this.textWindow.currentItem();
        if (ch === CharacterCodes.e || ch === CharacterCodes.E) {
            this.textWindow.moveToNextItem();

            ch = this.textWindow.currentItem();
            if (ch === CharacterCodes.minus || ch === CharacterCodes.plus) {
                if (CharacterInfo.isDecimalDigit(this.textWindow.peekItemN(1))) {
                    this.textWindow.moveToNextItem();
                }
            }
        }

        while (CharacterInfo.isDecimalDigit(this.textWindow.currentItem())) {
            this.textWindow.moveToNextItem();
        }

        var end = this.textWindow.absoluteIndex();

        this.tokenInfo.Text = this.textWindow.substring(start, end, /*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private scanHexNumericLiteral(): void {
        var start = this.textWindow.absoluteIndex();

        Debug.assert(this.isHexNumericLiteral());
        this.textWindow.moveToNextItem();
        this.textWindow.moveToNextItem();

        while (CharacterInfo.isHexDigit(this.textWindow.currentItem())) {
            this.textWindow.moveToNextItem();
        }

        var end = this.textWindow.absoluteIndex();
        this.tokenInfo.Text = this.textWindow.substring(start, end, /*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private isHexNumericLiteral(): bool {
        if (this.textWindow.currentItem() === CharacterCodes._0) {
            var ch = this.textWindow.peekItemN(1);
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

    private scanIdentifier(): void {
        var start = this.textWindow.absoluteIndex();

        while (this.isIdentifierPart()) {
            this.scanCharOrUnicodeEscape(this.errors);
        }

        var end = this.textWindow.absoluteIndex();
        this.tokenInfo.Text = this.textWindow.substring(start, end, /*intern:*/ true);
        this.tokenInfo.Kind = SyntaxKind.IdentifierNameToken;
    }

    private isIdentifierStart_Fast(character: number): bool {
        if ((character >= CharacterCodes.a && character <= CharacterCodes.z) ||
            (character >= CharacterCodes.A && character <= CharacterCodes.Z) ||
            character === CharacterCodes._ ||
            character === CharacterCodes.$) {
            return true;
        }

        return false;
    }

    private isIdentifierStart_Slow(): bool {
        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierStart(ch, this.languageVersion);
    }

    private isIdentifierStart(character: number): bool {
        return this.isIdentifierStart_Fast(character) || this.isIdentifierStart_Slow();
    }

    private isIdentifierPart_Fast(): bool {
        var character = this.textWindow.currentItem();
        if (this.isIdentifierStart_Fast(character)) {
            return true;
        }

        return character >= CharacterCodes._0 && character <= CharacterCodes._9;
    }

    private isIdentifierPart_Slow(): bool {
        if (this.isIdentifierStart_Slow()) {
            return true;
        }

        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierPart(ch, this.languageVersion);
    }

    private isIdentifierPart(): bool {
        return this.isIdentifierPart_Fast() || this.isIdentifierPart_Slow();
    }

    private scanIdentifierOrKeyword(): void {
        this.scanIdentifier();

        var kind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
        if (kind != SyntaxKind.None) {
            this.tokenInfo.KeywordKind = kind;
        }
    }

    private advanceAndSetTokenKind(kind: SyntaxKind): void {
        this.textWindow.moveToNextItem();
        this.tokenInfo.Kind = kind;
    }

    private scanGreaterThanToken(): void {
        // NOTE(cyrusn): If we want to support generics, we will likely have to stop lexing
        // the >> and >>> constructs here and instead construct those in the parser.
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();
        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanToken();
        } else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanToken(): void {
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();

        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
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
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();

        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
        }
    }

    private scanLessThanToken(): void {
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.LessThanEqualsToken;
        }
        else if (this.textWindow.currentItem() === CharacterCodes.lessThan) {
            this.textWindow.moveToNextItem();
            if (this.textWindow.currentItem() === CharacterCodes.equals) {
                this.textWindow.moveToNextItem();
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
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarEqualsToken;
        }
        else if (this.textWindow.currentItem() === CharacterCodes.bar) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarBarToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.BarToken;
        }
    }

    private scanCaretToken(): void {
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.CaretEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.CaretToken;
        }
    }

    private scanAmpersandToken(): void {
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();
        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandEqualsToken;
        }
        else if (this.textWindow.currentItem() === CharacterCodes.ampersand) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandAmpersandToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AmpersandToken;
        }
    }

    private scanPercentToken(): void {
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PercentEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PercentToken;
        }
    }

    private scanMinusToken(): void {
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();

        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.MinusEqualsToken;
        }
        else if (character === CharacterCodes.minus) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.MinusMinusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.MinusToken;
        }
    }

    private scanPlusToken(): void {
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem();
        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PlusEqualsToken;
        }
        else if (character === CharacterCodes.plus) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PlusPlusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PlusToken;
        }
    }

    private scanAsteriskToken(): void {
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AsteriskEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AsteriskToken;
        }
    }

    private scanEqualsToken(): void {
        this.textWindow.moveToNextItem();
        var character = this.textWindow.currentItem()
        if (character === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();

            if (this.textWindow.currentItem() === CharacterCodes.equals) {
                this.textWindow.moveToNextItem();

                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsEqualsToken;
            }
            else {
                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsToken;
            }
        }
        else if (character === CharacterCodes.greaterThan) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.EqualsGreaterThanToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.EqualsToken;
        }
    }

    private isDotPrefixedNumericLiteral(): bool {
        if (this.textWindow.currentItem() === CharacterCodes.dot) {
            var ch = this.textWindow.peekItemN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }

        return false;
    }

    private scanDotToken(): void {
        if (this.isDotPrefixedNumericLiteral()) {
            this.scanNumericLiteral();
            return;
        }

        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.dot &&
            this.textWindow.peekItemN(1) === CharacterCodes.dot) {

            this.textWindow.moveToNextItem();
            this.textWindow.moveToNextItem();
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

        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.SlashEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.SlashToken;
        }
    }

    private tryScanRegularExpressionToken(): bool {
        switch (this.previousTokenKind) {
            case SyntaxKind.IdentifierNameToken:
                if (this.previousTokenKeywordKind == SyntaxKind.None) {
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

        Debug.assert(this.textWindow.currentItem() === CharacterCodes.slash);

        var start = this.textWindow.absoluteIndex();
        var rewindPoint = this.textWindow.getRewindPoint();
        try {
            this.textWindow.moveToNextItem();

            var skipNextSlash = false;
            while (true) {
                var ch = this.textWindow.currentItem();
                if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                    this.textWindow.rewind(rewindPoint);
                    return false;
                }

                this.textWindow.moveToNextItem();
                if (!skipNextSlash && ch === CharacterCodes.slash) {
                    break;
                }
                else if (!skipNextSlash && ch === CharacterCodes.backslash) {
                    skipNextSlash = true;
                    continue;
                }

                skipNextSlash = false;
            }

            while (this.isIdentifierPart()) {
                this.scanCharOrUnicodeEscape(this.errors);
            }

            var end = this.textWindow.absoluteIndex();
            this.tokenInfo.Kind = SyntaxKind.RegularExpressionLiteral;
            this.tokenInfo.Text = this.textWindow.substring(start, end, /*intern:*/ false);
            return true;
        }
        finally {
            this.textWindow.releaseRewindPoint(rewindPoint);
        }
    }

    private scanExclamationToken(): void {
        this.textWindow.moveToNextItem();
        if (this.textWindow.currentItem() === CharacterCodes.equals) {
            this.textWindow.moveToNextItem();

            if (this.textWindow.currentItem() === CharacterCodes.equals) {
                this.textWindow.moveToNextItem();

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

    private scanDefaultCharacter(character: number, isEscaped: bool): void {
        var start = this.textWindow.absoluteIndex();
        this.textWindow.moveToNextItem();
        this.tokenInfo.Text = this.textWindow.substring(start, start + 1, /*intern:*/ true);
        this.tokenInfo.Kind = SyntaxKind.ErrorToken;
        this.addSimpleDiagnosticInfo(DiagnosticCode.Unexpected_character_0, this.tokenInfo.Text);
    }

    private skipEscapeSequence(): void {
        Debug.assert(this.textWindow.currentItem() === CharacterCodes.backslash);

        var rewindPoint = this.textWindow.getRewindPoint();
        try {
        // Consume the backslash.
            this.textWindow.moveToNextItem();

        // Get the char after the backslash
            var ch = this.textWindow.currentItem();
            this.textWindow.moveToNextItem();
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
                    this.textWindow.rewind(rewindPoint);
                    var value = this.scanUnicodeOrHexEscape(this.errors);
                    return;

                case CharacterCodes.carriageReturn:
                    // If it's \r\n then consume both characters.
                    if (this.textWindow.currentItem() === CharacterCodes.newLine) {
                        this.textWindow.moveToNextItem();
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
            this.textWindow.releaseRewindPoint(rewindPoint);
        }
    }

    private scanStringLiteral(): void {
        var quoteCharacter = this.textWindow.currentItem();

        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);

        var start = this.textWindow.absoluteIndex();
        this.textWindow.moveToNextItem();

        while (true) {
            var ch = this.textWindow.currentItem();
            if (ch === CharacterCodes.backslash) {
                this.skipEscapeSequence();
            }
            else if (ch === quoteCharacter) {
                this.textWindow.moveToNextItem();
                break;
            }
            else if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                this.addSimpleDiagnosticInfo(DiagnosticCode.Missing_closing_quote_character);
                break;
            }
            else {
                this.textWindow.moveToNextItem();
            }
        }

        var end = this.textWindow.absoluteIndex();
        this.tokenInfo.Text = this.textWindow.substring(start, end, true);
        this.tokenInfo.Kind = SyntaxKind.StringLiteral;
    }

    private isUnicodeOrHexEscape(): bool {
        return this.isUnicodeEscape() || this.isHexEscape();
    }

    private isUnicodeEscape(): bool {
        if (this.textWindow.currentItem() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekItemN(1);
            if (ch2 === CharacterCodes.u) {
                return true;
            }
        }

        return false;
    }

    private isHexEscape(): bool {
        if (this.textWindow.currentItem() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekItemN(1);
            if (ch2 === CharacterCodes.x) {
                return true;
            }
        }

        return false;
    }

    private peekCharOrUnicodeOrHexEscape(): number {
        if (this.isUnicodeOrHexEscape()) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return this.textWindow.currentItem();
        }
    }

    private peekCharOrUnicodeEscape(): number {
        if (this.isUnicodeEscape()) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return this.textWindow.currentItem();
        }
    }

    private peekUnicodeOrHexEscape(): number {
        var rewindPoint = this.textWindow.getRewindPoint();

        // if we're peeking, then we don't want to change the position
        var ch = this.scanUnicodeOrHexEscape(/*errors:*/ null);
        this.textWindow.rewind(rewindPoint);
        this.textWindow.releaseRewindPoint(rewindPoint);
        return ch;
    }

    private scanCharOrUnicodeEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.textWindow.currentItem();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekItemN(1);
            if (ch2 === CharacterCodes.u) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.textWindow.moveToNextItem();
        return ch;
    }

    private scanCharOrUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.textWindow.currentItem();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekItemN(1);
            if (ch2 === CharacterCodes.u || ch2 === CharacterCodes.x) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.textWindow.moveToNextItem();
        return ch;
    }

    private scanUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var start = this.textWindow.absoluteIndex();
        var character = this.textWindow.currentItem();
        Debug.assert(character === CharacterCodes.backslash);
        this.textWindow.moveToNextItem();

        character = this.textWindow.currentItem();
        Debug.assert(character === CharacterCodes.u || character === CharacterCodes.x);

        var intChar = 0;
        this.textWindow.moveToNextItem();

        var count = character === CharacterCodes.u ? 4 : 2;

        for (var i = 0; i < count; i++) {
            var ch2 = this.textWindow.currentItem();
            if (!CharacterInfo.isHexDigit(ch2)) {
                if (errors !== null) {
                    var end = this.textWindow.absoluteIndex();
                    var info = this.createIllegalEscapeDiagnostic(start, end);
                    errors.push(info);
                }

                break;
            }

            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.textWindow.moveToNextItem();
        }

        return intChar;
    }

    private createIllegalEscapeDiagnostic(start: number, end: number): SyntaxDiagnosticInfo {
        return new SyntaxDiagnosticInfo(start, end - start,
            DiagnosticCode.Unrecognized_escape_sequence);
    }
}