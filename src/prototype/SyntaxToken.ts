///<reference path='References.ts' />

module SyntaxToken {
    export function realize(token: ISyntaxToken, text: IText): ISyntaxToken {
        return new RealizedToken(token, text);
    }

    export function collectTextElements(token: ISyntaxToken, text: IText, elements: string[]): void {
        token.leadingTrivia(text).collectTextElements(text, elements);
        elements.push(token.text());
        token.trailingTrivia(text).collectTextElements(text, elements);
    }

    export function toJSON(token: ISyntaxToken, includeRealTrivia: bool) {
        var result: any = {
            kind: (<any>SyntaxKind)._map[token.tokenKind]
        };

        if (token.keywordKind() !== SyntaxKind.None) {
            result.keywordKind = (<any>SyntaxKind)._map[token.keywordKind()];
        }

        result.start = token.start();
        if (token.fullStart() !== token.start()) {
            result.fullStart = token.fullStart();
        }

        result.width = token.width();
        if (token.fullWidth() !== token.width()) {
            result.fullWidth = token.fullWidth();
        }

        if (token.isMissing()) {
            result.isMissing = true;
        }

        result.text = token.text();

        if (token.value() !== null) {
            result.value = token.value;
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

        if (includeRealTrivia) {
            result.leadingTrivia = token.leadingTrivia(null);
            result.trailingTrivia = token.trailingTrivia(null);
        }

        return result;
    }

    export function value(token: ISyntaxToken, value: any): string {
        // TODO: compute values for things like numeric or string literals.
        return value;
    }

    export function valueText(token: ISyntaxToken): string {
        // TODO: specialize on IdentifierName token with null value.  In that case we need to 
        // process the escape codes and make a real value for this token.  Remember, don't do
        // this for keywords.

        var value = token.value();
        return value === null
            ? null
            : typeof value === 'string'
                ? value
                : value.toString();
    }

    class EmptyToken implements ISyntaxToken {
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;

        constructor(fullStart: number, kind: SyntaxKind, keywordKind: SyntaxKind) {
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._keywordKind = keywordKind;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind() { return this.tokenKind; }

        public toJSON(key) { return toJSON(this, false); }
        public keywordKind() { return this._keywordKind; }
        public fullStart() { return this._fullStart; }
        public fullWidth() { return 0; }
        public start() { return this._fullStart; }
        public width() { return 0; }
        public fullEnd(): number { return this._fullStart; }
        public end(): number { return this._fullStart; }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(itext: IText): string { return ""; }
        public value() { return null; }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia() { return false; }
        public hasLeadingCommentTrivia() { return false; }
        public hasLeadingNewLineTrivia() { return false; }
        public hasTrailingTrivia() { return false; }
        public hasTrailingCommentTrivia() { return false; }
        public hasTrailingNewLineTrivia() { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    export function createEmpty(fullStart: number, kind: SyntaxKind, keywordKind: SyntaxKind): ISyntaxToken {
        return new EmptyToken(fullStart, kind, keywordKind);
    }

    class ElasticToken implements ISyntaxToken {
        private _keywordKind: SyntaxKind;
        private _leadingTrivia: ISyntaxTriviaList;
        private _text: string;
        private _trailingTrivia: ISyntaxTriviaList;

        constructor(kind: SyntaxKind,
            keywordKind: SyntaxKind,
            leadingTrivia: ISyntaxTriviaList,
            text: string,
            trailingTrivia: ISyntaxTriviaList) {
            this.tokenKind = kind;
            this._keywordKind = keywordKind;
            this._leadingTrivia = leadingTrivia;
            this._text = text;
            this._trailingTrivia = trailingTrivia;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public tokenKind: SyntaxKind;

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { throw Errors.notYetImplemented(); }
        public fullEnd(): number { throw Errors.notYetImplemented(); }

        public start(): number { throw Errors.notYetImplemented(); }
        public end(): number { throw Errors.notYetImplemented(); }

        public fullWidth(): number {
            return this._leadingTrivia.fullWidth() + this.width() + this._trailingTrivia.fullWidth();
        }

        public width(): number {
            return this._text.length;
        }

        public text(): string {
            return this._text;
        }

        public fullText(text: IText): string {
            return this._leadingTrivia.fullText(text) + this.text() + this._trailingTrivia.fullText(text);
        }

        public value(): any {
            return null;
        }

        public valueText(): string {
            return null;
        }

        public hasLeadingTrivia(): bool {
            return this._leadingTrivia.count() > 0;
        }

        public hasLeadingCommentTrivia(): bool {
            return this._leadingTrivia.hasComment();
        }

        public hasLeadingNewLineTrivia(): bool {
            return this._trailingTrivia.hasNewLine();
        }

        public hasTrailingTrivia(): bool {
            return this._trailingTrivia.count() > 0;
        }

        public hasTrailingCommentTrivia(): bool {
            return this._trailingTrivia.hasComment();
        }

        public hasTrailingNewLineTrivia(): bool {
            return this._trailingTrivia.hasNewLine();
        }

        public leadingTrivia(text: IText): ISyntaxTriviaList { return this._leadingTrivia; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return this._trailingTrivia; }
        
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class RealizedToken implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _token: ISyntaxToken;
        private _text: IText;

        constructor(token: ISyntaxToken,
            text: IText) {
            this.tokenKind = token.tokenKind;
            this._token = token;
            this._text = text;
        }

        public kind(): SyntaxKind { return this._token.kind(); }
        public toJSON(key) { return toJSON(this, true); }

        public isToken(): bool { return this._token.isToken(); }
        public isNode(): bool { return this._token.isNode(); }
        public isList(): bool { return this._token.isList(); }
        public isSeparatedList(): bool { return this._token.isSeparatedList(); }
        public isTrivia(): bool { return this._token.isTrivia(); }
        public isTriviaList(): bool { return this._token.isTriviaList(); }
        public isMissing(): bool { return this._token.isMissing(); }

        public keywordKind(): SyntaxKind { return this._token.keywordKind(); }

        public fullStart(): number { return this._token.fullStart(); }
        public fullWidth(): number { return this._token.fullWidth(); }
        public fullEnd(): number { return this._token.fullEnd(); }

        public start(): number { return this._token.start(); }
        public width(): number { return this._token.width(); }
        public end(): number { return this._token.end(); }

        public text(): string { return this._token.text(); }
        public fullText(text: IText): string { return this._token.fullText(this._text); }

        public value(): any { return this._token.value(); }
        public valueText(): string { return this._token.value(); }

        public hasLeadingTrivia(): bool { return this._token.hasLeadingTrivia(); }
        public hasLeadingCommentTrivia(): bool { return this._token.hasLeadingCommentTrivia(); }
        public hasLeadingNewLineTrivia(): bool { return this._token.hasLeadingNewLineTrivia(); }

        public hasTrailingTrivia(): bool { return this._token.hasTrailingTrivia(); }
        public hasTrailingCommentTrivia(): bool { return this._token.hasTrailingCommentTrivia(); }
        public hasTrailingNewLineTrivia(): bool { return this._token.hasTrailingNewLineTrivia(); }

        public leadingTrivia(text: IText): ISyntaxTriviaList { return this._token.leadingTrivia(this._text); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return this._token.trailingTrivia(this._text); }

        public realize(text: IText): ISyntaxToken { return this; }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    export function createElasticKeyword(token: IElasticToken): ISyntaxToken {
        token.keywordKind = token.kind;
        token.kind = SyntaxKind.IdentifierNameToken;

        return createElastic(token);
    }

    export function createElastic(token: IElasticToken): ISyntaxToken {
        var text = token.text ? token.text :
            token.keywordKind ? SyntaxFacts.getText(token.keywordKind) : SyntaxFacts.getText(token.kind);

        return new ElasticToken(
            token.kind,
            token.keywordKind ? token.keywordKind : SyntaxKind.None,
            SyntaxTriviaList.create(token.leadingTrivia),
            text,
            SyntaxTriviaList.create(token.trailingTrivia));
    }
}