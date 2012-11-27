///<reference path='References.ts' />

class ScannerTokenInfo {
    public Kind: SyntaxKind;
    public KeywordKind: SyntaxKind;
    public Text: string;
    public HasUnicodeEscapeSequence: bool;
}

class ScannerTriviaInfo {
    public Width: number;
    public HasComment: bool;
}

class Scanner {
    private _text: IText = null;
    private builder: number[] = [];
    private identifierBuffer: number[] = [];
    private identifierLength = 0;
    private stringTable: StringTable = null;
    private errors: SyntaxDiagnosticInfo[] = [];
    private textWindow: SlidingTextWindow = null;
    private languageVersion: LanguageVersion;

    public static create(text: IText, languageVersion: LanguageVersion): Scanner {
        return new Scanner(text, languageVersion, new StringTable());
    }

    constructor(text: IText, languageVersion: LanguageVersion, stringTable: StringTable) {
        Contract.throwIfNull(stringTable);

        this._text = text;
        this.identifierBuffer = ArrayUtilities.createArray(32);
        this.stringTable = stringTable;
        this.textWindow = new SlidingTextWindow(text, stringTable);
        this.languageVersion = languageVersion;
    }

    public text(): IText {
        return this._text;
    }

    private addComplexDiagnosticInfo(position: number, width: number, code: DiagnosticCode, ...args: any[]): void {
        this.addDiagnosticInfo(this.makeComplexDiagnosticInfo(position, width, code, args));
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

    private makeComplexDiagnosticInfo(position: number, width: number, code: DiagnosticCode, ...args: any[]): SyntaxDiagnosticInfo {
        var offset = position >= this.textWindow.startPosition() ? position - this.textWindow.startPosition() : position;
        return new SyntaxDiagnosticInfo(offset, width, code, args);
    }

    private makeSimpleDiagnosticInfo(code: DiagnosticCode, args: any[]): SyntaxDiagnosticInfo {
        return SyntaxDiagnosticInfo.create(code, args);
    }

    private previousTokenKind: SyntaxKind = SyntaxKind.None;
    private tokenInfo: ScannerTokenInfo = new ScannerTokenInfo();
    private leadingTriviaInfo = new ScannerTriviaInfo();
    private trailingTriviaInfo = new ScannerTriviaInfo();

    public scan(): ISyntaxToken {
        if (this.errors.length > 0) {
            this.errors = [];
        }

        var start = this.textWindow.position();
        this.scanTriviaInfo(/*afterFirstToken: */ this.textWindow.position() > 0, /*isTrailing: */ false, this.leadingTriviaInfo);
        this.scanSyntaxToken();
        this.scanTriviaInfo(/* afterFirstToken: */ true, /*isTrailing: */true, this.trailingTriviaInfo);

        this.previousTokenKind = this.tokenInfo.Kind;
        return this.createToken(start);
    }

    private createToken(start: number): ISyntaxToken {
        return SyntaxToken.create(start, this.leadingTriviaInfo, this.tokenInfo, this.trailingTriviaInfo,
            this.errors.length == 0 ? null : this.errors);
    }

    private scanTriviaInfo(afterFirstToken: bool, isTrailing: bool, triviaInfo: ScannerTriviaInfo): void {
        this.textWindow.start();
        triviaInfo.Width = 0;
        triviaInfo.HasComment = false;

        while (true) {
            var ch = this.textWindow.peekCharAtPosition();

            switch (ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark:
                    this.textWindow.advanceChar1();
                    triviaInfo.Width++;
                    continue;
            }

            // TODO: Handle unicode space characters.
            if (ch === CharacterCodes.slash) {
                var ch2 = this.textWindow.peekCharN(1);
                if (ch2 === CharacterCodes.slash) {
                    this.textWindow.advanceChar1();
                    this.textWindow.advanceChar1();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;

                    this.scanSingleLineCommentTrivia(triviaInfo);
                    continue;
                }

                if (ch2 === CharacterCodes.asterisk) {
                    this.textWindow.advanceChar1();
                    this.textWindow.advanceChar1();
                    triviaInfo.Width += 2;
                    triviaInfo.HasComment = true;

                    this.scanMultiLineCommentTrivia(triviaInfo);
                    continue;
                }

                return;
            }

            if (this.isNewLineCharacter(ch)) {
                if (ch === CharacterCodes.carriageReturn) {
                    this.textWindow.advanceChar1();
                    triviaInfo.Width++;
                }

                ch = this.textWindow.peekCharAtPosition();
                if (ch === CharacterCodes.newLine) {
                    this.textWindow.advanceChar1();
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
        return ch === CharacterCodes.carriageReturn || ch === CharacterCodes.newLine;
    }

    private scanSingleLineCommentTrivia(triviaInfo: ScannerTriviaInfo): void {
        while (true) {
            var ch = this.textWindow.peekCharAtPosition();
            if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                return;
            }

            this.textWindow.advanceChar1();
            triviaInfo.Width++;
        }
    }

    private scanMultiLineCommentTrivia(triviaInfo: ScannerTriviaInfo): void {
        while (true) {
            var ch = this.textWindow.peekCharAtPosition();
            if (ch === CharacterCodes.nullCharacter) {
                return;
            }

            if (ch === CharacterCodes.asterisk && this.textWindow.peekCharN(1) === CharacterCodes.slash) {
                this.textWindow.advanceChar1();
                this.textWindow.advanceChar1();
                triviaInfo.Width += 2;
                return;
            }

            this.textWindow.advanceChar1();
            triviaInfo.Width++;
        }
    }

    private scanSyntaxToken(): void {
        this.textWindow.start();

        this.tokenInfo.Kind = SyntaxKind.None;
        this.tokenInfo.KeywordKind = SyntaxKind.None;
        this.tokenInfo.Text = null;
        this.tokenInfo.HasUnicodeEscapeSequence = false;

        var character = this.textWindow.peekCharAtPosition();
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
        while (CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }

        if (this.textWindow.peekCharAtPosition() === CharacterCodes.dot) {
            this.textWindow.advanceChar1();
        }

        while (CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }

        var ch = this.textWindow.peekCharAtPosition();
        if (ch === CharacterCodes.e || ch === CharacterCodes.E) {
            this.textWindow.advanceChar1();
        }

        ch = this.textWindow.peekCharAtPosition();
        if (ch === CharacterCodes.minus || ch === CharacterCodes.plus) {
            this.textWindow.advanceChar1();
        }

        while (CharacterInfo.isDecimalDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }

        this.tokenInfo.Text = this.textWindow.getText(/*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private scanHexNumericLiteral(): void {
        Debug.assert(this.isHexNumericLiteral());
        this.textWindow.advanceChar1();
        this.textWindow.advanceChar1();

        while (CharacterInfo.isHexDigit(this.textWindow.peekCharAtPosition())) {
            this.textWindow.advanceChar1();
        }

        this.tokenInfo.Text = this.textWindow.getText(/*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private isHexNumericLiteral(): bool {
        if (this.textWindow.peekCharAtPosition() === CharacterCodes._0) {
            var ch = this.textWindow.peekCharN(1);
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
        while (this.isIdentifierPart()) {
            this.tokenInfo.HasUnicodeEscapeSequence = this.tokenInfo.HasUnicodeEscapeSequence || this.isUnicodeEscape();

            this.scanCharOrUnicodeEscape(this.errors);
        }

        this.tokenInfo.Text = this.textWindow.getText(/*intern:*/ true);
        this.tokenInfo.Kind = SyntaxKind.IdentifierNameToken;
    }

    private isIdentifierStart(character: number): bool {
        if ((character >= CharacterCodes.a && character <= CharacterCodes.z) ||
            (character >= CharacterCodes.A && character <= CharacterCodes.Z) ||
            character === CharacterCodes._ ||
            character === CharacterCodes.$) {
            return true;
        }

        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierStart(ch, this.languageVersion);
    }

    private isIdentifierPart(): bool {
        var character = this.textWindow.peekCharAtPosition();
        if (this.isIdentifierStart(character)) {
            return true;
        }

        var ch = this.peekCharOrUnicodeEscape();
        return Unicode.isIdentifierPart(ch, this.languageVersion);
    }

    private scanIdentifierOrKeyword(): void {
        this.scanIdentifier();

        if (this.tokenInfo.HasUnicodeEscapeSequence) {
            return;
        }

        var kind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
        if (kind != SyntaxKind.None) {
            this.tokenInfo.KeywordKind = kind;
        }
    }

    private advanceAndSetTokenKind(kind: SyntaxKind): void {
        this.textWindow.advanceChar1();
        this.tokenInfo.Kind = kind;
    }

    private scanGreaterThanToken(): void {
        // NOTE(cyrusn): If we want to support generics, we will likely have to stop lexing
        // the >> and >>> constructs here and instead construct those in the parser.
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanToken();
        } else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanToken(): void {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();

        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
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
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();

        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
        }
    }

    private scanLessThanToken(): void {
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.LessThanEqualsToken;
        }
        else if (this.textWindow.peekCharAtPosition() === CharacterCodes.lessThan) {
            this.textWindow.advanceChar1();
            if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                this.textWindow.advanceChar1();
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
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.BarEqualsToken;
        }
        else if (this.textWindow.peekCharAtPosition() === CharacterCodes.bar) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.BarBarToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.BarToken;
        }
    }

    private scanCaretToken(): void {
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.CaretEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.CaretToken;
        }
    }

    private scanAmpersandToken(): void {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.AmpersandEqualsToken;
        }
        else if (this.textWindow.peekCharAtPosition() === CharacterCodes.ampersand) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.AmpersandAmpersandToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AmpersandToken;
        }
    }

    private scanPercentToken(): void {
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.PercentEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PercentToken;
        }
    }

    private scanMinusToken(): void {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();

        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.MinusEqualsToken;
        }
        else if (character === CharacterCodes.minus) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.MinusMinusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.MinusToken;
        }
    }

    private scanPlusToken(): void {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition();
        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.PlusEqualsToken;
        }
        else if (character === CharacterCodes.plus) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.PlusPlusToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PlusToken;
        }
    }

    private scanAsteriskToken(): void {
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.AsteriskEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AsteriskToken;
        }
    }

    private scanEqualsToken(): void {
        this.textWindow.advanceChar1();
        var character = this.textWindow.peekCharAtPosition()
        if (character === CharacterCodes.equals) {
            this.textWindow.advanceChar1();

            if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                this.textWindow.advanceChar1();

                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsEqualsToken;
            }
            else {
                this.tokenInfo.Kind = SyntaxKind.EqualsEqualsToken;
            }
        }
        else if (character === CharacterCodes.greaterThan) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.EqualsGreaterThanToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.EqualsToken;
        }
    }

    private isDotPrefixedNumericLiteral(): bool {
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.dot) {
            var ch = this.textWindow.peekCharN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }

        return false;
    }

    private scanDotToken(): void {
        if (this.isDotPrefixedNumericLiteral()) {
            this.scanNumericLiteral();
            return;
        }

        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.dot &&
            this.textWindow.peekCharN(1) === CharacterCodes.dot) {

            this.textWindow.advanceChar1();
            this.textWindow.advanceChar1();
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

        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();
            this.tokenInfo.Kind = SyntaxKind.SlashEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.SlashToken;
        }
    }

    private tryScanRegularExpressionToken(): bool {
        switch (this.previousTokenKind) {
            case SyntaxKind.IdentifierNameToken:
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

        Debug.assert(this.textWindow.peekCharAtPosition() === CharacterCodes.slash);
        var start = this.textWindow.position();

        this.textWindow.advanceChar1();

        var skipNextSlash = false;
        while (true) {
            var ch = this.textWindow.peekCharAtPosition();
            if (this.isNewLineCharacter(ch) || ch === CharacterCodes.nullCharacter) {
                this.textWindow.reset(start);
                return false;
            }

            this.textWindow.advanceChar1();
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

        this.tokenInfo.Kind = SyntaxKind.RegularExpressionLiteral;
        this.tokenInfo.Text = this.textWindow.getText(/*intern:*/ false);
        return true;
    }

    private scanExclamationToken(): void {
        this.textWindow.advanceChar1();
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
            this.textWindow.advanceChar1();

            if (this.textWindow.peekCharAtPosition() === CharacterCodes.equals) {
                this.textWindow.advanceChar1();

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
        this.textWindow.advanceChar1();
        this.tokenInfo.Text = this.textWindow.getText(/*intern:*/ true);
        this.tokenInfo.Kind = SyntaxKind.ErrorToken;
        this.addSimpleDiagnosticInfo(DiagnosticCode.Unexpected_character_0, this.tokenInfo.Text);
    }

    private scanEscapeSequence(): number {
        var start = this.textWindow.position();
        var ch = this.textWindow.peekCharAtPosition();
        this.textWindow.advanceChar1();
        Debug.assert(ch === CharacterCodes.backslash);

        ch = this.textWindow.peekCharAtPosition();
        this.textWindow.advanceChar1();
        switch (ch) {
            case CharacterCodes.singleQuote:
            case CharacterCodes.doubleQuote:
            case CharacterCodes.backslash:
                return ch;
            case CharacterCodes._0:
                return CharacterCodes.nullCharacter;
            case CharacterCodes.b:
                return CharacterCodes.backspace;
            case CharacterCodes.f:
                return CharacterCodes.formFeed;
            case CharacterCodes.n:
                return CharacterCodes.newLine;
            case CharacterCodes.r:
                return CharacterCodes.carriageReturn;
            case CharacterCodes.t:
                return CharacterCodes.tab;
            case CharacterCodes.v:
                return CharacterCodes.verticalTab;
            case CharacterCodes.x:
            case CharacterCodes.u:
                this.textWindow.reset(start);
                return this.scanUnicodeOrHexEscape(this.errors);
            default:
                this.addComplexDiagnosticInfo(start, this.textWindow.position() - start, DiagnosticCode.Unrecognized_escape_sequence);
                return ch;
        }
    }

    private scanStringLiteral(): void {
        var quoteCharacter = this.textWindow.peekCharAtPosition();

        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);

        this.textWindow.advanceChar1();

        while (true) {
            var ch = this.textWindow.peekCharAtPosition();
            if (ch === CharacterCodes.backslash) {
                ch = this.scanEscapeSequence();
            }
            else if (ch === quoteCharacter) {
                this.textWindow.advanceChar1();
                break;
            }
            else if (ch === CharacterCodes.nullCharacter) {
                this.addSimpleDiagnosticInfo(DiagnosticCode.Missing_closing_quote_character);
                break;
            }
            else {
                this.textWindow.advanceChar1();
            }
        }

        this.tokenInfo.Text = this.textWindow.getText(true);
        this.tokenInfo.Kind = SyntaxKind.StringLiteral;
    }

    private isUnicodeOrHexEscape(): bool {
        return this.isUnicodeEscape() || this.isHexEscape();
    }

    private isUnicodeEscape(): bool {
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if (ch2 === CharacterCodes.u) {
                return true;
            }
        }

        return false;
    }

    private isHexEscape(): bool {
        if (this.textWindow.peekCharAtPosition() === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if (ch2 === CharacterCodes.h) {
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
            return this.textWindow.peekCharAtPosition();
        }
    }

    private peekCharOrUnicodeEscape(): number {
        if (this.isUnicodeEscape()) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return this.textWindow.peekCharAtPosition();
        }
    }

    private peekUnicodeOrHexEscape(): number {
        var position = this.textWindow.position();

        // if we're peeking, then we don't want to change the position
        var ch = this.scanUnicodeOrHexEscape(/*errors:*/ null);
        this.textWindow.reset(position);
        return ch;
    }

    private scanCharOrUnicodeEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.textWindow.peekCharAtPosition();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if (ch2 === CharacterCodes.u) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.textWindow.advanceChar1();
        return ch;
    }

    private scanCharOrUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var ch = this.textWindow.peekCharAtPosition();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.textWindow.peekCharN(1);
            if (ch2 === CharacterCodes.u || ch2 === CharacterCodes.h) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.textWindow.advanceChar1();
        return ch;
    }

    private scanUnicodeOrHexEscape(errors: SyntaxDiagnosticInfo[]): number {
        var start = this.textWindow.position();
        var character = this.textWindow.peekCharAtPosition();
        Debug.assert(character === CharacterCodes.backslash);
        this.textWindow.advanceChar1();

        character = this.textWindow.peekCharAtPosition();
        Debug.assert(character === CharacterCodes.u || character === CharacterCodes.h);

        var intChar = 0;
        this.textWindow.advanceChar1();

        var count = character === CharacterCodes.u ? 4 : 2;

        for (var i = 0; i < count; i++) {
            var ch2 = this.textWindow.peekCharAtPosition();
            if (!CharacterInfo.isHexDigit(ch2)) {
                if (errors !== null) {
                    var info = this.createIllegalEscapeDiagnostic(start);
                    errors.push(info);
                }

                break;
            }

            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.textWindow.advanceChar1();
        }

        return intChar;
    }

    private createIllegalEscapeDiagnostic(start: number): SyntaxDiagnosticInfo {
        return new SyntaxDiagnosticInfo(
            start - this.textWindow.startPosition(),
            this.textWindow.position() - start,
            DiagnosticCode.Unrecognized_escape_sequence);
    }
}