///<reference path='SlidingWindow.ts' />

///<reference path='Constants.ts' />
///<reference path='DiagnosticCode.ts' />
///<reference path='LanguageVersion.ts' />
///<reference path='IText.ts' />
///<reference path='..\harness\external\json2.ts' />
///<reference path='ScannerUtilities.generated.ts' />
///<reference path='StringTable.ts' />
///<reference path='SyntaxDiagnostic.ts' />
///<reference path='SyntaxToken.generated.ts' />
///<reference path='Unicode.ts' />

class Scanner extends SlidingWindow {
    private text: IText = null;
    private stringTable: StringTable;
    private languageVersion: LanguageVersion;

    private static isKeywordStartCharacter: bool[] = [];
    private static isIdentifierStartCharacter: bool[] = [];
    public static isIdentifierPartCharacter: bool[] = [];
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

    private kind: SyntaxKind = SyntaxKind.None;
    private width: number = 0;

    public scan(diagnostics: SyntaxDiagnostic[], allowRegularExpression: bool): ISyntaxToken {
        var fullStart = this.absoluteIndex();
        var leadingTriviaInfo = this.scanTriviaInfo(diagnostics, /*isTrailing: */ false);
        this.scanSyntaxToken(diagnostics, allowRegularExpression);
        var trailingTriviaInfo = this.scanTriviaInfo(diagnostics,/*isTrailing: */true);
        return SyntaxToken.create(
            this.text, fullStart, this.kind, leadingTriviaInfo, 
            this.width, trailingTriviaInfo);
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
        // We're going to be extracting text out of sliding window.  Make sure it can't move past
        // this point.
        var absoluteStartIndex = this.getAndPinAbsoluteIndex();

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
        
        // TODO: we probably should intern whitespace.
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, /*intern:*/ false);
        this.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);

        return SyntaxTrivia.create(SyntaxKind.WhitespaceTrivia, text);
    }
    
    private scanSingleLineCommentTrivia(): ISyntaxTrivia {
        var absoluteStartIndex = this.getAndPinAbsoluteIndex();
        var width = this.scanSingleLineCommentTriviaLength();
        
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, /*intern:*/ false);
        this.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);

        return SyntaxTrivia.create(SyntaxKind.SingleLineCommentTrivia, text);
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
        var absoluteStartIndex = this.getAndPinAbsoluteIndex();
        var width = this.scanMultiLineCommentTriviaLength(null);
        
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, /*intern:*/ false);
        this.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);

        return SyntaxTrivia.create(SyntaxKind.MultiLineCommentTrivia, text);
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
        var absoluteStartIndex = this.getAndPinAbsoluteIndex();
        var width = this.scanLineTerminatorSequenceLength(ch);
        
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, /*intern:*/ false);
        this.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);

        return SyntaxTrivia.create(SyntaxKind.NewLineTrivia, text);
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
        this.kind = SyntaxKind.None;
        this.width = 0;

        if (this.isAtEndOfSource()) {
            this.kind = SyntaxKind.EndOfFileToken;
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
                this.width = endIndex - startIndex; // = this.substring(startIndex, endIndex, /*intern:*/ true);
                this.kind = SyntaxKind.IdentifierNameToken;

                // Also check if it a keyword if it started with a lowercase letter.
                if (Scanner.isKeywordStartCharacter[firstCharacter]) {
                    var offset = startIndex - this.windowAbsoluteStartIndex;
                    this.kind = ScannerUtilities.identifierKind(this.window, offset, endIndex - startIndex); // SyntaxFacts.getTokenKind(this.tokenInfo.Text);
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
        this.width = endIndex - startIndex;
        this.kind = SyntaxKind.IdentifierNameToken;

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

        this.width = endIndex - startIndex;
        this.kind = SyntaxKind.NumericLiteral;
    }

    private scanHexNumericLiteral(startIndex: number): void {
        Debug.assert(this.isHexNumericLiteral());
        this.moveToNextItem();
        this.moveToNextItem();

        while (CharacterInfo.isHexDigit(this.currentCharCode())) {
            this.moveToNextItem();
        }

        var endIndex = this.absoluteIndex();
        this.width = endIndex - startIndex;
        this.kind = SyntaxKind.NumericLiteral;
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
        this.kind = kind;
    }

    private scanGreaterThanToken(): void {
        // NOTE(cyrusn): If we want to support generics, we will likely have to stop lexing
        // the >> and >>> constructs here and instead construct those in the parser.
        this.moveToNextItem();
        var character = this.currentCharCode();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.GreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanToken();
        } else {
            this.kind = SyntaxKind.GreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.GreaterThanGreaterThanEqualsToken;
        }
        else if (character === CharacterCodes.greaterThan) {
            this.scanGreaterThanGreaterThanGreaterThanToken();
        }
        else {
            this.kind = SyntaxKind.GreaterThanGreaterThanToken;
        }
    }

    private scanGreaterThanGreaterThanGreaterThanToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
        }
        else {
            this.kind = SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
        }
    }

    private scanLessThanToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.LessThanEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.lessThan) {
            this.moveToNextItem();
            if (this.currentCharCode() === CharacterCodes.equals) {
                this.moveToNextItem();
                this.kind = SyntaxKind.LessThanLessThanEqualsToken;
            }
            else {
                this.kind = SyntaxKind.LessThanLessThanToken;
            }
        }
        else {
            this.kind = SyntaxKind.LessThanToken;
        }
    }

    private scanBarToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.BarEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.bar) {
            this.moveToNextItem();
            this.kind = SyntaxKind.BarBarToken;
        }
        else {
            this.kind = SyntaxKind.BarToken;
        }
    }

    private scanCaretToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.CaretEqualsToken;
        }
        else {
            this.kind = SyntaxKind.CaretToken;
        }
    }

    private scanAmpersandToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.AmpersandEqualsToken;
        }
        else if (this.currentCharCode() === CharacterCodes.ampersand) {
            this.moveToNextItem();
            this.kind = SyntaxKind.AmpersandAmpersandToken;
        }
        else {
            this.kind = SyntaxKind.AmpersandToken;
        }
    }

    private scanPercentToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.PercentEqualsToken;
        }
        else {
            this.kind = SyntaxKind.PercentToken;
        }
    }

    private scanMinusToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();

        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.MinusEqualsToken;
        }
        else if (character === CharacterCodes.minus) {
            this.moveToNextItem();
            this.kind = SyntaxKind.MinusMinusToken;
        }
        else {
            this.kind = SyntaxKind.MinusToken;
        }
    }

    private scanPlusToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode();
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.PlusEqualsToken;
        }
        else if (character === CharacterCodes.plus) {
            this.moveToNextItem();
            this.kind = SyntaxKind.PlusPlusToken;
        }
        else {
            this.kind = SyntaxKind.PlusToken;
        }
    }

    private scanAsteriskToken(): void {
        this.moveToNextItem();
        if (this.currentCharCode() === CharacterCodes.equals) {
            this.moveToNextItem();
            this.kind = SyntaxKind.AsteriskEqualsToken;
        }
        else {
            this.kind = SyntaxKind.AsteriskToken;
        }
    }

    private scanEqualsToken(): void {
        this.moveToNextItem();
        var character = this.currentCharCode()
        if (character === CharacterCodes.equals) {
            this.moveToNextItem();

            if (this.currentCharCode() === CharacterCodes.equals) {
                this.moveToNextItem();

                this.kind = SyntaxKind.EqualsEqualsEqualsToken;
            }
            else {
                this.kind = SyntaxKind.EqualsEqualsToken;
            }
        }
        else if (character === CharacterCodes.greaterThan) {
            this.moveToNextItem();
            this.kind = SyntaxKind.EqualsGreaterThanToken;
        }
        else {
            this.kind = SyntaxKind.EqualsToken;
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
            this.kind = SyntaxKind.DotDotDotToken;
        }
        else {
            this.kind = SyntaxKind.DotToken;
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
            this.kind = SyntaxKind.SlashEqualsToken;
        }
        else {
            this.kind = SyntaxKind.SlashToken;
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
            this.kind = SyntaxKind.RegularExpressionLiteral;
            this.width = endIndex - startIndex;
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

                this.kind = SyntaxKind.ExclamationEqualsEqualsToken;
            }
            else {
                this.kind = SyntaxKind.ExclamationEqualsToken;
            }
        }
        else {
            this.kind = SyntaxKind.ExclamationToken;
        }
    }

    private scanDefaultCharacter(character: number, diagnostics: SyntaxDiagnostic[]): void {
        var position = this.absoluteIndex();
        this.moveToNextItem();
        this.width = 1;
        this.kind = SyntaxKind.ErrorToken;

        var text = String.fromCharCode(character);
        var messageText = this.getErrorMessageText(text);
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

    // Code for if we ever want the value of a string literal:
    //    private skipEscapeSequence(diagnostics: SyntaxDiagnostic[]): void {
    //    Debug.assert(this.currentCharCode() === CharacterCodes.backslash);

    //    var rewindPoint = this.getAndPinAbsoluteIndex();
    //    try {
    //    // Consume the backslash.
    //        this.moveToNextItem();

    //    // Get the char after the backslash
    //        var ch = this.currentCharCode();
    //        this.moveToNextItem();
    //        switch (ch) {
    //            case CharacterCodes.singleQuote:
    //            case CharacterCodes.doubleQuote:
    //            case CharacterCodes.backslash:
    //                // value is ch itself;
    //                return;

    //            case CharacterCodes._0:
    //                // TODO: Deal with this part of the spec rule: 0 [lookahead ∉DecimalDigit]
    //                // value is CharacterCodes.nullCharacter;
    //                return;

    //            case CharacterCodes.b:
    //                // value is CharacterCodes.backspace;
    //                return;

    //            case CharacterCodes.f:
    //                // value is CharacterCodes.formFeed;
    //                return;

    //            case CharacterCodes.n:
    //                // value is CharacterCodes.newLine;
    //                return;

    //            case CharacterCodes.r:
    //                // value is CharacterCodes.carriageReturn;
    //                return;

    //            case CharacterCodes.t:
    //                // value is CharacterCodes.tab;
    //                return;

    //            case CharacterCodes.v:
    //                // value is CharacterCodes.verticalTab;
    //                return;

    //            case CharacterCodes.x:
    //            case CharacterCodes.u:
    //                this.rewind(rewindPoint);
    //                var value = this.scanUnicodeOrHexEscape(diagnostics);
    //                return;

    //            case CharacterCodes.carriageReturn:
    //                // If it's \r\n then consume both characters.
    //                if (this.currentCharCode() === CharacterCodes.lineFeed) {
    //                    this.moveToNextItem();
    //                }
    //                return;
    //            case CharacterCodes.lineFeed:
    //            case CharacterCodes.paragraphSeparator:
    //            case CharacterCodes.lineSeparator:
    //                return;

    //            default:
    //                // Any other character is ok as well.  As per rule:
    //                // EscapeSequence :: CharacterEscapeSequence
    //                // CharacterEscapeSequence :: NonEscapeCharacter
    //                // NonEscapeCharacter :: SourceCharacter but notEscapeCharacter or LineTerminator
    //                return;
    //        }
    //    }
    //    finally {
    //        this.releaseAndUnpinAbsoluteIndex(rewindPoint);
    //    }
    //}

    private skipEscapeSequence(diagnostics: SyntaxDiagnostic[]): void {
        Debug.assert(this.currentCharCode() === CharacterCodes.backslash);

        var rewindPoint = this.getAndPinAbsoluteIndex();
        try {
            // Consume the backslash.
            this.moveToNextItem();

            // Get the char after the backslash
            var ch = this.currentCharCode();
            this.moveToNextItem();
            switch (ch) {
                case CharacterCodes.x:
                case CharacterCodes.u:
                    this.rewindToPinnedIndex(rewindPoint);
                    var value = this.scanUnicodeOrHexEscape(diagnostics);
                    return;

                case CharacterCodes.carriageReturn:
                    // If it's \r\n then consume both characters.
                    if (this.currentCharCode() === CharacterCodes.lineFeed) {
                        this.moveToNextItem();
                    }
                    return;

                // We don't have to do anything special about these characters.  I'm including them
                // Just so it's clear that we intentially process them in the exact same way:
                //case CharacterCodes.singleQuote:
                //case CharacterCodes.doubleQuote:
                //case CharacterCodes.backslash:
                //case CharacterCodes._0:
                //case CharacterCodes.b:
                //case CharacterCodes.f:
                //case CharacterCodes.n:
                //case CharacterCodes.r:
                //case CharacterCodes.t:
                //case CharacterCodes.v:
                //case CharacterCodes.lineFeed:
                //case CharacterCodes.paragraphSeparator:
                //case CharacterCodes.lineSeparator:
                default:
                    // Any other character is ok as well.  As per rule:
                    // EscapeSequence :: CharacterEscapeSequence
                    // CharacterEscapeSequence :: NonEscapeCharacter
                    // NonEscapeCharacter :: SourceCharacter but notEscapeCharacter or LineTerminator
                    return;
            }
        }
        finally {
            this.releaseAndUnpinAbsoluteIndex(rewindPoint);
        }
    }

    private scanStringLiteral(diagnostics: SyntaxDiagnostic[]): void {
        var quoteCharacter = this.currentCharCode();

        Debug.assert(quoteCharacter === CharacterCodes.singleQuote || quoteCharacter === CharacterCodes.doubleQuote);

        var startIndex = this.absoluteIndex();
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
        this.width = endIndex - startIndex;
        this.kind = SyntaxKind.StringLiteral;
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

        Debug.assert(offset >= 0);
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