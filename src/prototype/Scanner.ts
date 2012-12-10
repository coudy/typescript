///<reference path='References.ts' />

class ScannerTokenInfo {
    public Kind: SyntaxKind;
    public KeywordKind: SyntaxKind;
    public Text: string;
    public Value: any;
}

class Scanner extends SlidingWindow {
    private text: IText = null;
    private stringTable: StringTable;
    private languageVersion: LanguageVersion;

    private static isKeywordStartCharacter: bool[] = [];
    private static isIdentifierStartCharacter: bool[] = [];
    private static isIdentifierPartCharacter: bool[] = [];
    private static isNumericLiteralStart: bool[] = [];

    private static initializeStaticData() {
        if (Scanner.isKeywordStartCharacter.length === 0) {
            Scanner.isKeywordStartCharacter = ArrayUtilities.createArray(CharacterCodes.maxAsciiCharacter, false);
            Scanner.isIdentifierStartCharacter = ArrayUtilities.createArray(CharacterCodes.maxAsciiCharacter, false);
            Scanner.isIdentifierPartCharacter = ArrayUtilities.createArray(CharacterCodes.maxAsciiCharacter, false);
            Scanner.isNumericLiteralStart = ArrayUtilities.createArray(CharacterCodes.maxAsciiCharacter, false);

            for (var character = 0; character < CharacterCodes.maxAsciiCharacter; character++) {
                if (character >= CharacterCodes.a && character <= CharacterCodes.z) {
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
                    Scanner.isNumericLiteralStart[character] = true;
                }
            }

            Scanner.isNumericLiteralStart[CharacterCodes.dot] = true;

            for (var keywordKind = SyntaxKind.FirstKeyword; keywordKind <= SyntaxKind.LastKeyword; keywordKind++) {
                var keyword = SyntaxFacts.getText(keywordKind);
                Scanner.isKeywordStartCharacter[keyword.charCodeAt(0)] = true;
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

    private fetchMoreItems(argument: any, sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    }

    private currentCharCode(): number {
        return this.currentItem(null);
    }

    private tokenInfo: ScannerTokenInfo = new ScannerTokenInfo();

    public scan(diagnostics: SyntaxDiagnostic[], allowRegularExpression: bool): ISyntaxToken {
        var fullStart = this.absoluteIndex();
        var leadingTriviaInfo = this.scanTriviaInfo(diagnostics, /*isTrailing: */ false);
        this.scanSyntaxToken(diagnostics, allowRegularExpression);
        var trailingTriviaInfo = this.scanTriviaInfo(diagnostics,/*isTrailing: */true);
        return SyntaxToken.create(this.text, fullStart, leadingTriviaInfo, this.tokenInfo, trailingTriviaInfo);
    }

    public static scanTrivia(text: IText, start: number, length: number, isTrailing: bool): ISyntaxTriviaList {
        Debug.assert(length > 0);
        var scanner = new Scanner(text.subText(new TextSpan(start, length)), LanguageVersion.EcmaScript5, null);
        return scanner.scanTrivia(isTrailing);
    }
    
    private scanTrivia(isTrailing: bool): ISyntaxTriviaList {
        // Keep this exactly in sync with scanTriviaInfo

        var trivia: ISyntaxTrivia[] = [];

        while (true) {
            if (!this.isAtEndOfSource()) {
                var ch = this.currentCharCode();

                switch (ch) {
                    case CharacterCodes.space:
                    case CharacterCodes.tab:
                    case CharacterCodes.verticalTab:
                    case CharacterCodes.formFeed:
                    case CharacterCodes.nonBreakingSpace:
                    case CharacterCodes.byteOrderMark:
                        // Normal whitespace.  Consume and continue.
                        trivia.push(this.scanWhitespaceTrivia());
                        continue;

                    case CharacterCodes.slash:
                        // Potential comment.  Consume if so.  Otherwise, break out and return.
                        var ch2 = this.peekItemN(1);
                        if (ch2 === CharacterCodes.slash) {
                            trivia.push(this.scanSingleLineCommentTrivia());
                            continue;
                        }

                        if (ch2 === CharacterCodes.asterisk) {
                            trivia.push(this.scanMultiLineCommentTrivia());
                            continue;
                        }

                        // Not a comment.  Don't consume.
                        throw Errors.invalidOperation();

                    case CharacterCodes.carriageReturn:
                    case CharacterCodes.lineFeed:
                    case CharacterCodes.paragraphSeparator:
                    case CharacterCodes.lineSeparator:
                        trivia.push(this.scanLineTerminatorSequenceTrivia(ch));

                        // If we're consuming leading trivia, then we will continue consuming more 
                        // trivia (including newlines) up to the first token we see.  If we're 
                        // consuming trailing trivia, then we break after the first newline we see.
                        if (!isTrailing) {
                            continue;
                        }

                        break;

                    default:
                        throw Errors.invalidOperation();
                }
            }

            Debug.assert(trivia.length > 0);
            return SyntaxTriviaList.create(trivia);
        }
    }

    private scanTriviaInfo(diagnostics: SyntaxDiagnostic[], isTrailing: bool): number {
        // Keep this exactly in sync with scanTrivia

        var width = 0;
        var hasComment = false;
        var hasNewLine = false;

        while (true) {
            var ch = this.currentCharCode();

            switch (ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark:
                    // Normal whitespace.  Consume and continue.
                    this.moveToNextItem();
                    width++;
                    continue;

                case CharacterCodes.slash:
                    // Potential comment.  Consume if so.  Otherwise, break out and return.
                    var ch2 = this.peekItemN(1);
                    if (ch2 === CharacterCodes.slash) {
                        hasComment = true;
                        width += this.scanSingleLineCommentTriviaLength();
                        continue;
                    }

                    if (ch2 === CharacterCodes.asterisk) {
                        hasComment = true;
                        width += this.scanMultiLineCommentTriviaLength(diagnostics);
                        continue;
                    }

                    // Not a comment.  Don't consume.
                    break;

                case CharacterCodes.carriageReturn:
                case CharacterCodes.lineFeed:
                case CharacterCodes.paragraphSeparator:
                case CharacterCodes.lineSeparator:
                    hasNewLine = true;
                    width += this.scanLineTerminatorSequenceLength(ch);

                    // If we're consuming leading trivia, then we will continue consuming more 
                    // trivia (including newlines) up to the first token we see.  If we're 
                    // consuming trailing trivia, then we break after the first newline we see.
                    if (!isTrailing) {
                        continue;
                    }

                    break;
            }

            return width | (hasComment ? Constants.TriviaCommentMask : 0) | (hasNewLine ? Constants.TriviaNewLineMask : 0);
        }
    }

    private isNewLineCharacter(ch: number): bool {
        switch (ch) {
            case CharacterCodes.carriageReturn:
            case CharacterCodes.lineFeed:
            case CharacterCodes.paragraphSeparator:
            case CharacterCodes.lineSeparator:
                return true;
            default:
                return false;
        }
    }

    private scanWhitespaceTrivia(): ISyntaxTrivia {
        var start = this.absoluteIndex();
        var width = 0;
        while (true) {
            var ch = this.currentCharCode();

            switch (ch) {
                case CharacterCodes.space:
                case CharacterCodes.tab:
                case CharacterCodes.verticalTab:
                case CharacterCodes.formFeed:
                case CharacterCodes.nonBreakingSpace:
                case CharacterCodes.byteOrderMark:
                    // Normal whitespace.  Consume and continue.
                    this.moveToNextItem();
                    width++;
                    continue;
            }

            break;
        }
        
        return SyntaxTrivia.create(SyntaxKind.WhitespaceTrivia, start, this.substring(start, start + width, /*intern:*/ false));
    }
    
    private scanSingleLineCommentTrivia(): ISyntaxTrivia {
        var start = this.absoluteIndex();
        var width = this.scanSingleLineCommentTriviaLength();
        return SyntaxTrivia.create(SyntaxKind.SingleLineCommentTrivia, start, this.substring(start, start + width, /*intern:*/ false));
    }

    private scanSingleLineCommentTriviaLength(): number {
        this.moveToNextItem();
        this.moveToNextItem();
        
        // The '2' is for the "//" we consumed.
        var width = 2;
        while (true) {
            if (this.isAtEndOfSource() || this.isNewLineCharacter(this.currentCharCode())) {
                return width;
            }

            this.moveToNextItem();
            width++;
        }
    }

    private scanMultiLineCommentTrivia(): ISyntaxTrivia {
        var start = this.absoluteIndex();
        var width = this.scanMultiLineCommentTriviaLength(null);
        return SyntaxTrivia.create(SyntaxKind.MultiLineCommentTrivia, start, this.substring(start, start + width, /*intern:*/ false));
    }

    private scanMultiLineCommentTriviaLength(diagnostics: SyntaxDiagnostic[]): number {
        this.moveToNextItem();
        this.moveToNextItem();

        // The '2' is for the "/*" we consumed.
        var width = 2;
        while (true) {
            if (this.isAtEndOfSource()) {
                if (diagnostics !== null) {
                    diagnostics.push(new SyntaxDiagnostic(
                        this.absoluteIndex(), 0, DiagnosticCode._StarSlash__expected, null));
                }

                return width;
            }

            var ch = this.currentCharCode();
            if (ch === CharacterCodes.asterisk && this.peekItemN(1) === CharacterCodes.slash) {
                this.moveToNextItem();
                this.moveToNextItem();
                width += 2;
                return width;
            }

            this.moveToNextItem();
            width++;
        }
    }

    private scanLineTerminatorSequenceTrivia(ch: number): ISyntaxTrivia {
        var start = this.absoluteIndex();
        var width = this.scanLineTerminatorSequenceLength(ch);
        return SyntaxTrivia.create(SyntaxKind.NewLineTrivia, start, this.substring(start, start + width, /*intern:*/ false));
    }

    private scanLineTerminatorSequenceLength(ch: number): number {
        // Consume the first of the line terminator we saw.
        this.moveToNextItem();

        // If it happened to be a \r and there's a following \n, then consume both.
        if (ch === CharacterCodes.carriageReturn && this.currentCharCode() === CharacterCodes.lineFeed) {
            this.moveToNextItem();
            return 2;
        }
        else {
            return 1;
        }
    }

    private scanSyntaxToken(diagnostics: SyntaxDiagnostic[], allowRegularExpression: bool): void {
        this.tokenInfo.Kind = SyntaxKind.None;
        this.tokenInfo.KeywordKind = SyntaxKind.None;
        this.tokenInfo.Text = null;
        this.tokenInfo.Value = null;

        if (this.isAtEndOfSource()) {
            this.tokenInfo.Kind = SyntaxKind.EndOfFileToken;
            this.tokenInfo.Text = "";
            return;
        }

        var character = this.currentCharCode();

        switch (character) {
            case CharacterCodes.doubleQuote:
            case CharacterCodes.singleQuote:
                return this.scanStringLiteral(diagnostics);

            // These are the set of variable width punctuation tokens.
            case CharacterCodes.slash:
                return this.scanSlashToken(allowRegularExpression);

            case CharacterCodes.dot:
                return this.scanDotToken();

            case CharacterCodes.minus:
                return this.scanMinusToken();

            case CharacterCodes.exclamation:
                return this.scanExclamationToken();

            case CharacterCodes.equals:
                return this.scanEqualsToken();

            case CharacterCodes.bar:
                return this.scanBarToken();

            case CharacterCodes.asterisk:
                return this.scanAsteriskToken();

            case CharacterCodes.plus:
                return this.scanPlusToken();

            case CharacterCodes.percent:
                return this.scanPercentToken();

            case CharacterCodes.ampersand:
                return this.scanAmpersandToken();

            case CharacterCodes.caret:
                return this.scanCaretToken();

            case CharacterCodes.lessThan:
                return this.scanLessThanToken();

            case CharacterCodes.greaterThan:
                return this.scanGreaterThanToken();

            // These are the set of fixed, single character length punctuation tokens.
            // The token kind does not depend on what follows.
            case CharacterCodes.comma:
                return this.advanceAndSetTokenKind(SyntaxKind.CommaToken);

            case CharacterCodes.colon:
                return this.advanceAndSetTokenKind(SyntaxKind.ColonToken);

            case CharacterCodes.semicolon:
                return this.advanceAndSetTokenKind(SyntaxKind.SemicolonToken);

            case CharacterCodes.tilde:
                return this.advanceAndSetTokenKind(SyntaxKind.TildeToken);

            case CharacterCodes.openParen:
                return this.advanceAndSetTokenKind(SyntaxKind.OpenParenToken);

            case CharacterCodes.closeParen:
                return  this.advanceAndSetTokenKind(SyntaxKind.CloseParenToken);

            case CharacterCodes.openBrace:
                return this.advanceAndSetTokenKind(SyntaxKind.OpenBraceToken);

            case CharacterCodes.closeBrace:
                return this.advanceAndSetTokenKind(SyntaxKind.CloseBraceToken);

            case CharacterCodes.openBracket:
                return this.advanceAndSetTokenKind(SyntaxKind.OpenBracketToken);

            case CharacterCodes.closeBracket:
                return this.advanceAndSetTokenKind(SyntaxKind.CloseBracketToken);

            case CharacterCodes.question:
                return this.advanceAndSetTokenKind(SyntaxKind.QuestionToken);
        }

        if (Scanner.isNumericLiteralStart[character]) {
            this.scanNumericLiteral();
            return;
        }

        // We run into so many identifiers (and keywords) when scanning, that we want the code to
        // be as fast as possible.  To that end, we have an extremely fast path for scanning that
        // handles the 99.9% case of no-unicode characters and no unicode escapes.
        if (Scanner.isIdentifierStartCharacter[character]) {
            if (this.tryFastScanIdentifierOrKeyword(character)) {
                return;
            }
        }

        if (this.isIdentifierStart(this.peekCharOrUnicodeEscape())) {
            this.slowScanIdentifier(diagnostics);
            return;
        }

        this.scanDefaultCharacter(character, diagnostics);
    }

    private isIdentifierStart(interpretedChar: number): bool {
        if (Scanner.isIdentifierStartCharacter[interpretedChar]) {
            return true;
        }

        return interpretedChar > CharacterCodes.maxAsciiCharacter && Unicode.isIdentifierStart(interpretedChar, this.languageVersion);
    }

    private isIdentifierPart(interpretedChar: number): bool {
        if (Scanner.isIdentifierPartCharacter[interpretedChar]) {
            return true;
        }

        return interpretedChar > CharacterCodes.maxAsciiCharacter && Unicode.isIdentifierPart(interpretedChar, this.languageVersion);
    }

    private tryFastScanIdentifierOrKeyword(firstCharacter: number): bool {
        var startIndex = this.getAndPinAbsoluteIndex();

        while (true) {
            var character = this.currentCharCode();
            if (Scanner.isIdentifierPartCharacter[character]) {
                // Still part of an identifier.  Move to the next caracter.
                this.moveToNextItem();
            }
            else if (character === CharacterCodes.backslash || character > CharacterCodes.maxAsciiCharacter) {
                // We saw a \ (which could start a unicode escape), or we saw a unicode character.
                // This can't be scanned quickly.  Reset to the beginning and bail out.  We'll 
                // go and try the slow path instead.
                this.rewindToPinnedIndex(startIndex);
                this.releaseAndUnpinAbsoluteIndex(startIndex);
                return false;
            }
            else {
                // Saw an ascii character that wasn't a backslash and wasn't an identifier 
                // character.  This identifier is done.
                var endIndex = this.absoluteIndex();
                this.tokenInfo.Text = this.substring(startIndex, endIndex, /*intern:*/ true);
                this.tokenInfo.Kind = SyntaxKind.IdentifierNameToken;

                // Also check if it a keyword if it started with a lowercase letter.
                if (Scanner.isKeywordStartCharacter[firstCharacter]) {
                    this.tokenInfo.KeywordKind = SyntaxFacts.getTokenKind(this.tokenInfo.Text);
                }

                if (this.tokenInfo.KeywordKind === SyntaxKind.None) {
                    // Because this was all simple ascii characters with no escapes in it, we can set
                    // the value for this token right now.  Otherwise, we will defer computing the 
                    // value till later.
                    this.tokenInfo.Value = this.tokenInfo.Text;
                }

                this.releaseAndUnpinAbsoluteIndex(startIndex);
                return true;
            }
        }
    }

    // A slow path for scanning identifiers.  Called when we run into a unicode character or 
    // escape sequence while processing the fast path.
    private slowScanIdentifier(diagnostics: SyntaxDiagnostic[]): void {
        var startIndex = this.getAndPinAbsoluteIndex();

        do {
            this.scanCharOrUnicodeEscape(diagnostics);
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

        //// From the spec:
        //// The source character immediately following a NumericLiteral must not be an 
        //// IdentifierStart or DecimalDigit.
        //if (this.isIdentifierStart(this.peekCharOrUnicodeEscape())) {
        //    diagnostics.add(new SyntaxDiagnostic(
        //        this.absoluteIndex(), 1, DiagnosticCode.Numeric_literal_can_not_be_followed_directly
        //}
    }

    private scanDecimalNumericLiteral(startIndex: number): void {
        while (CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }

        if (this.currentCharCode() === CharacterCodes.dot) {
            this.moveToNextItem();
        }

        while (CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }

        var ch = this.currentCharCode();
        if (ch === CharacterCodes.e || ch === CharacterCodes.E) {
            this.moveToNextItem();

            ch = this.currentCharCode();
            if (ch === CharacterCodes.minus || ch === CharacterCodes.plus) {
                if (CharacterInfo.isDecimalDigit(this.peekItemN(1))) {
                    this.moveToNextItem();
                }
            }
        }

        while (CharacterInfo.isDecimalDigit(this.currentCharCode())) {
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

        while (CharacterInfo.isHexDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }

        var end = this.absoluteIndex();
        this.tokenInfo.Text = this.substring(start, end, /*intern:*/ false);
        this.tokenInfo.Kind = SyntaxKind.NumericLiteral;
    }

    private isHexNumericLiteral(): bool {
        if (this.currentCharCode() === CharacterCodes._0) {
            var ch = this.peekItemN(1);

            if (ch === CharacterCodes.x || ch === CharacterCodes.X) {
                ch = this.peekItemN(2);

                return CharacterInfo.isHexDigit(ch);
            }
        }

        return false;
    }

    private advanceAndSetTokenKind(kind: SyntaxKind): void {
        this.moveToNextItem();
        this.tokenInfo.Kind = kind;
    }

    private scanGreaterThanToken(): void {
        // NOTE(cyrusn): If we want to support generics, we will likely have to stop lexing
        // the >> and >>> constructs here and instead construct those in the parser.
        this.moveToNextItem();
        var character = this.currentCharCode();
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
        var character = this.currentCharCode();

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
        var character = this.currentCharCode();

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
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.LessThanEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.lessThan) {
            this.moveToNextItem();
            if (this.currentCharCode() === CharacterCodes.equals) {
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
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.bar) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.BarBarToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.BarToken;
        }
    }

    private scanCaretToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.CaretEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.CaretToken;
        }
    }

    private scanAmpersandToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.ampersand) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AmpersandAmpersandToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AmpersandToken;
        }
    }

    private scanPercentToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.PercentEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.PercentToken;
        }
    }

    private scanMinusToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();

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
        var character = this.currentCharCode();
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
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.AsteriskEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.AsteriskToken;
        }
    }

    private scanEqualsToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode()
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();

            if (this.currentCharCode() === CharacterCodes.equals) {
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
        if (this.currentCharCode() === CharacterCodes.dot) {
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
        if (this.currentCharCode() === CharacterCodes.dot &&
            this.peekItemN(1) === CharacterCodes.dot) {

            this.moveToNextItem();
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.DotDotDotToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.DotToken;
        }
    }

    private scanSlashToken(allowRegularExpression: bool): void {
        // NOTE: By default, we do not try scanning a / as a regexp here.  We instead consider it a
        // div or div-assign.  Later on, if the parser runs into a situation where it would like a 
        // term, and it sees one of these then it may restart us asking specifically if we could 
        // scan out a regex.
        if (allowRegularExpression && this.tryScanRegularExpressionToken()) {
            return;
        }

        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.tokenInfo.Kind = SyntaxKind.SlashEqualsToken;
        }
        else {
            this.tokenInfo.Kind = SyntaxKind.SlashToken;
        }
    }

    private tryScanRegularExpressionToken(): bool {
        Debug.assert(this.currentCharCode() === CharacterCodes.slash);

        var startIndex = this.getAndPinAbsoluteIndex();
        try {
            this.moveToNextItem();

            var inEscape = false;
            var inCharacterClass = false;
            while (true) {
                var ch = this.currentCharCode();
                if (this.isNewLineCharacter(ch) || this.isAtEndOfSource()) {
                    this.rewindToPinnedIndex(startIndex);
                    return false;
                }

                this.moveToNextItem();
                if (inEscape) {
                    inEscape = false;
                    continue;
                }

                switch (ch) {
                    case CharacterCodes.backslash:
                        // We're now in an escape.  Consume the next character we see (unless it's
                        // a newline or null.
                        inEscape = true;
                        continue;
                
                    case CharacterCodes.openBracket:
                        // If we see a [ then we're starting an character class.  Note: it's ok if 
                        // we then hit another [ inside a character class.  We'll just set the value
                        // to true again and that's ok.
                        inCharacterClass = true;
                        continue;

                    case CharacterCodes.closeBracket:
                        // If we ever hit a cloe bracket then we're now no longer in a character 
                        // class.  If we weren't in a character class to begin with, then this has 
                        // no effect.
                        inCharacterClass = false;
                        continue;

                    case CharacterCodes.slash:
                        // If we see a slash, and we're in a character class, then ignore it.
                        if (inCharacterClass) {
                            continue;
                        }

                        // We're done with the regex.  Break out of the switch (which will break 
                        // out of hte loop.
                        break;

                    default:
                        // Just consume any other characters.
                        continue;
                }

                break;
            }

            // TODO: The grammar says any identifier part is allowed here.  Do we need to support
            // \u identifiers here?  The existing typescript parser does not.  
            while (Scanner.isIdentifierPartCharacter[this.currentCharCode()]) {
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
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();

            if (this.currentCharCode() === CharacterCodes.equals) {
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

    private scanDefaultCharacter(character: number, diagnostics: SyntaxDiagnostic[]): void {
        var position = this.absoluteIndex();
        this.moveToNextItem();
        this.tokenInfo.Text = String.fromCharCode(character);
        this.tokenInfo.Kind = SyntaxKind.ErrorToken;

        var messageText = this.getErrorMessageText(this.tokenInfo.Text);
        diagnostics.push(new SyntaxDiagnostic(
            position, 1, DiagnosticCode.Unexpected_character_0, [messageText]));
    }

    // Convert text into a printable form usable for an error message.  This will both quote the 
    // string, and ensure all characters printable (i.e. by using unicode escapes when they're not).
    private getErrorMessageText(text: string): string {
        // For just a simple backslash, we return it as is.  The default behavior of JSON2.stringify
        // is not what we want here.
        if (text === "\\") {
            return '"\\"';
        }

        return JSON2.stringify(text);
    }

    private skipEscapeSequence(diagnostics: SyntaxDiagnostic[]): void {
        Debug.assert(this.currentCharCode() === CharacterCodes.backslash);

        var rewindPoint = this.getRewindPoint();
        try {
        // Consume the backslash.
            this.moveToNextItem();

        // Get the char after the backslash
            var ch = this.currentCharCode();
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
                    var value = this.scanUnicodeOrHexEscape(diagnostics);
                    return;

                case CharacterCodes.carriageReturn:
                    // If it's \r\n then consume both characters.
                    if (this.currentCharCode() === CharacterCodes.lineFeed) {
                        this.moveToNextItem();
                    }
                    return;
                case CharacterCodes.lineFeed:
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

    private scanStringLiteral(diagnostics: SyntaxDiagnostic[]): void {
        var quoteCharacter = this.currentCharCode();

        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);

        var startIndex = this.getAndPinAbsoluteIndex();
        this.moveToNextItem();

        while (true) {
            var ch = this.currentCharCode();
            if (ch === CharacterCodes.backslash) {
                this.skipEscapeSequence(diagnostics);
            }
            else if (ch === quoteCharacter) {
                this.moveToNextItem();
                break;
            }
            else if (this.isNewLineCharacter(ch) || this.isAtEndOfSource()) {
                diagnostics.push(new SyntaxDiagnostic(
                    this.absoluteIndex(), 1, DiagnosticCode.Missing_closing_quote_character, null));
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
        var character = this.currentCharCode();
        if (this.isUnicodeOrHexEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        }
        else {
            return character;
        }
    }

    private peekCharOrUnicodeEscape(): number {
        var character = this.currentCharCode();
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

    private scanCharOrUnicodeEscape(errors: SyntaxDiagnostic[]): number {
        var ch = this.currentCharCode();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.u) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.moveToNextItem();
        return ch;
    }

    private scanCharOrUnicodeOrHexEscape(errors: SyntaxDiagnostic[]): number {
        var ch = this.currentCharCode();
        if (ch === CharacterCodes.backslash) {
            var ch2 = this.peekItemN(1);
            if (ch2 === CharacterCodes.u || ch2 === CharacterCodes.x) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }

        this.moveToNextItem();
        return ch;
    }

    private scanUnicodeOrHexEscape(errors: SyntaxDiagnostic[]): number {
        var start = this.absoluteIndex();
        var character = this.currentCharCode();
        Debug.assert(character === CharacterCodes.backslash);
        this.moveToNextItem();

        character = this.currentCharCode();
        Debug.assert(character === CharacterCodes.u || character === CharacterCodes.x);

        var intChar = 0;
        this.moveToNextItem();

        var count = character === CharacterCodes.u ? 4 : 2;

        for (var i = 0; i < count; i++) {
            var ch2 = this.currentCharCode();
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

    private createIllegalEscapeDiagnostic(start: number, end: number): SyntaxDiagnostic {
        return new SyntaxDiagnostic(start, end - start,
            DiagnosticCode.Unrecognized_escape_sequence, null);
    }
}