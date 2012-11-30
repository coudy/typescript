///<reference path='References.ts' />

//class SimpleSyntaxToken implements ISyntaxToken {
//    private _kind: SyntaxKind;
//    private _keywordKind: SyntaxKind;
//    private _hasTrailingNewLine: bool;

//    constructor(kind: SyntaxKind, keywordKind: SyntaxKind, hasTrailingNewLine: bool) {
//        this._kind = kind;
//        this._keywordKind = keywordKind;
//        this._hasTrailingNewLine = hasTrailingNewLine;
//    }

//    public kind(): SyntaxKind {
//        return this._kind;
//    }

//    public keywordKind(): SyntaxKind {
//        return this._keywordKind;
//    }

//    public fullStart(): number {
//        throw new Error();
//    }

//    public fullWidth(): number {
//        throw new Error();
//    }

//    public start(): number {
//        throw new Error();
//    }

//    public width(): number {
//        throw new Error();
//    }

//    public isMissing(): bool {
//        return false;
//    }

//    public text(): string {
//        throw new Error();
//    }

//    public fullText(text: IText): string {
//        throw new Error();
//    }

//    public value(): any {
//        throw new Error();
//    }

//    public valueText(): string {
//        throw new Error();
//    }

//    public diagnostics(): DiagnosticInfo[] {
//        throw new Error();
//    }

//    public hasLeadingTrivia(): bool {
//        throw new Error();
//    }

//    public hasLeadingCommentTrivia(): bool {
//        throw new Error();
//    }

//    public hasLeadingNewLineTrivia(): bool {
//        throw new Error();
//    }

//    public hasTrailingTrivia(): bool {
//        throw new Error();
//    }

//    public hasTrailingCommentTrivia(): bool {
//        throw new Error();
//    }

//    public hasTrailingNewLineTrivia(): bool {
//        return this._hasTrailingNewLine;
//    }

//    public leadingTrivia(text: IText): ISyntaxTriviaList {
//        throw new Error();
//    }

//    public trailingTrivia(text: IText): ISyntaxTriviaList {
//        throw new Error();
//    }
//}

class StandardToken implements ISyntaxToken {
    private _kind: SyntaxKind;
    private _keywordKind: SyntaxKind;
    private _fullStart: number;
    private _leadingWidth: number;
    private _text: string;
    private _trailingWidth: number;
    private _diagnostics: DiagnosticInfo[];
    private _hasLeadingCommentTrivia: bool;
    private _hasLeadingNewLineTrivia: bool;
    private _hasTrailingCommentTrivia: bool;
    private _hasTrailingNewLineTrivia: bool;

    constructor(kind: SyntaxKind,
                keywordKind: SyntaxKind,
                text: string,
                fullStart: number,
                leadingWidth: number,
                trailingWidth: number,
                hasLeadingCommentTrivia: bool,
                hasTrailingCommentTrivia: bool,
                hasLeadingNewLineTrivia: bool,
                hasTrailingNewLineTrivia: bool,
                diagnostics: DiagnosticInfo[]) {
        this._kind = kind;
        this._keywordKind = keywordKind;
        this._text = text;
        this._fullStart = fullStart;
        this._leadingWidth = leadingWidth;
        this._trailingWidth = trailingWidth;
        this._hasLeadingCommentTrivia = hasLeadingCommentTrivia;
        this._hasLeadingNewLineTrivia = hasLeadingNewLineTrivia;
        this._hasTrailingCommentTrivia = hasTrailingCommentTrivia;
        this._hasTrailingNewLineTrivia = hasTrailingNewLineTrivia;
        this._diagnostics = diagnostics;
    }

    public toJSON(key) {
        return SyntaxToken.toJSON(this);
    }

    public kind() {
        return this._kind;
    }

    public keywordKind() {
        return this._keywordKind;
    }

    public fullStart() {
        return this._fullStart;
    }

    public fullWidth() {
        return this._leadingWidth + this._text.length + this._trailingWidth;
    }

    public start() {
        return this._fullStart + this._leadingWidth;
    }

    public width() {
        return this._text.length;
    }

    public isMissing() {
        return false;
    }

    public text() {
        return this._text;
    }

    public fullText(itext: IText): string {
        return itext.toString(new TextSpan(this._fullStart, this._leadingWidth)) +
               this._text +
               itext.toString(new TextSpan(this._fullStart + this._leadingWidth + this._text.length, this._trailingWidth));
    }

    public value(): string {
        // TODO: return proper value here.
        return null;
    }

    public valueText(): string {
        // TODO: return proper value here.
        return null;
    }

    public diagnostics() {
        return this._diagnostics;
    }

    public hasLeadingTrivia() {
        return this._leadingWidth > 0;
    }

    public hasLeadingCommentTrivia() {
        return this._hasLeadingCommentTrivia;
    }

    public hasLeadingNewLineTrivia() {
        return this._hasLeadingNewLineTrivia;
    }

    public hasTrailingTrivia() {
        return this._trailingWidth > 0;
    }

    public hasTrailingCommentTrivia() {
        return this._hasTrailingCommentTrivia;
    }

    public hasTrailingNewLineTrivia() {
        return this._hasTrailingNewLineTrivia;
    }

    public leadingTrivia(text: IText): ISyntaxTriviaList {
        throw Errors.notYetImplemented();
    }

    public trailingTrivia(text: IText): ISyntaxTriviaList {
        throw Errors.notYetImplemented();
    }
}

class SyntaxToken {
    public static create(fullStart: number,
                         leadingTriviaInfo: ScannerTriviaInfo,
                         tokenInfo: ScannerTokenInfo,
                         trailingTriviaInfo: ScannerTriviaInfo,
                         diagnostics: DiagnosticInfo[]): ISyntaxToken {
        // TODO: use a more efficient implementation for when there is no trivia, or the kind is
        // one of the well known types.
        // return new SimpleSyntaxToken(tokenInfo.Kind, tokenInfo.KeywordKind, trailingTriviaInfo.HasNewLine);
        return createStandardToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics);
    }

    public static toJSON(token: ISyntaxToken) {
        var result: any = {
            kind: (<any>SyntaxKind)._map[token.kind()]
        };

        if (token.keywordKind() != SyntaxKind.None) {
            result.keywordKind = (<any>SyntaxKind)._map[token.keywordKind()];
        }

        result.start = token.start();
        if (token.fullStart() != token.start()) {
            result.fullStart = token.fullStart();
        }

        result.width = token.width();
        if (token.fullWidth() != token.width()) {
            result.fullWidth = token.fullWidth();
        }

        if (token.isMissing()) {
            result.isMissing = true;
        }

        result.text = token.text();

        if (token.value() !== null) {
            result.value() = token.value;
        }

        if (token.valueText() !== null) {
            result.valueText = token.valueText();
        }

        if (token.hasLeadingTrivia()) {
            result.hasLeadingTrivia = true;
        }

        if (token.hasLeadingCommentTrivia()) {
            result.hasLeadingCommentTrivia = true;
        }

        if (token.hasLeadingNewLineTrivia()) {
            result.hasLeadingNewLineTrivia = true;
        }

        if (token.hasTrailingTrivia()) {
            result.hasTrailingTrivia = true;
        }

        if (token.hasTrailingCommentTrivia()) {
            result.hasTrailingCommentTrivia = true;
        }

        if (token.hasTrailingNewLineTrivia()) {
            result.hasTrailingNewLineTrivia = true;
        }

        var diagnostics = token.diagnostics();
        if (diagnostics && diagnostics.length > 0) {
            result.diagnostics = diagnostics;
        }

        return result;
    }

    public static createStandardToken(fullStart: number,
                                      leadingTriviaInfo: ScannerTriviaInfo,
                                      tokenInfo: ScannerTokenInfo,
                                      trailingTriviaInfo: ScannerTriviaInfo,
                                      diagnostics: DiagnosticInfo[]): ISyntaxToken {
        var kind = tokenInfo.Kind;
        var keywordKind = tokenInfo.KeywordKind;
        var text = tokenInfo.Text == null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        Contract.throwIfNull(text);
        var leadingWidth = leadingTriviaInfo.Width;
        var trailingWidth = trailingTriviaInfo.Width;

        var leadingComment = leadingTriviaInfo.HasComment;
        var trailingComment = trailingTriviaInfo.HasComment;

        var leadingNewLine = leadingTriviaInfo.HasNewLine;
        var trailingNewLine = trailingTriviaInfo.HasNewLine;

        return new StandardToken(
            kind, keywordKind, text, fullStart, leadingWidth, trailingWidth,
             leadingComment, trailingComment, leadingNewLine, trailingNewLine, diagnostics);
    }

    // TODO: This needs to take in the proper position.
    public static createEmptyToken(kind: SyntaxKind): ISyntaxToken {
        var token: ISyntaxToken;
        token = {
            toJSON:(key) => SyntaxToken.toJSON(token),
            kind: () => kind,
            keywordKind: () => SyntaxKind.None,
            fullStart: () => 0,
            fullWidth: () => 0,
            start: () => 0,
            width: () => 0,
            isMissing: () => true,
            text: () => "",
            fullText: (itext: IText): string => "",
            value: () => null,
            valueText: () => "",
            diagnostics: () => [],
            hasLeadingTrivia: () => false,
            hasLeadingCommentTrivia: () => false,
            hasLeadingNewLineTrivia: () => false,
            hasTrailingTrivia: () => false,
            hasTrailingCommentTrivia: () => false,
            hasTrailingNewLineTrivia: () => false,
            leadingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
            trailingTrivia: (text: IText): ISyntaxTriviaList => SyntaxTriviaList.empty,
        };

        return token;
    }
}