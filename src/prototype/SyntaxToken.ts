///<reference path='References.ts' />

module SyntaxToken {
    export function realize(token: ISyntaxToken): ISyntaxToken {
        return new RealizedToken(token.tokenKind, token.keywordKind(), token.fullStart(),
            token.leadingTrivia(), token.text(), token.value(), token.valueText(), token.trailingTrivia(),
            token.isMissing());
    }

    export function collectTextElements(token: ISyntaxToken, elements: string[]): void {
        token.leadingTrivia().collectTextElements(elements);
        elements.push(token.text());
        token.trailingTrivia().collectTextElements(elements);
    }

    export function toJSON(token: ISyntaxToken) {
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

        var trivia = token.leadingTrivia();
        if (trivia.count() > 0) {
            result.leadingTrivia = trivia;
        }

        trivia = token.trailingTrivia();
        if (trivia.count() > 0) {
            result.trailingTrivia = trivia;
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

        public toJSON(key) { return toJSON(this); }
        public keywordKind() { return this._keywordKind; }
        public fullStart() { return this._fullStart; }
        public fullWidth() { return 0; }
        public start() { return this._fullStart; }
        public width() { return 0; }
        public fullEnd(): number { return this._fullStart; }
        public end(): number { return this._fullStart; }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(): string { return ""; }
        public value() { return null; }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia() { return false; }
        public hasLeadingCommentTrivia() { return false; }
        public hasLeadingNewLineTrivia() { return false; }
        public hasTrailingTrivia() { return false; }
        public hasTrailingCommentTrivia() { return false; }
        public hasTrailingNewLineTrivia() { return false; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withFullStart(fullStart: number): ISyntaxToken {
            return new EmptyToken(fullStart, this.kind(), this.keywordKind());
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }

        public withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }
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

        public fullStart(): number { return 0; }
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

        public fullText(): string {
            return this._leadingTrivia.fullText() + this.text() + this._trailingTrivia.fullText();
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

        public leadingTrivia(): ISyntaxTriviaList { return this._leadingTrivia; }
        public trailingTrivia(): ISyntaxTriviaList { return this._trailingTrivia; }
        
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withFullStart(fullStart: number): ISyntaxToken {
            return this.realize().withFullStart(fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class RealizedToken implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTrivia: ISyntaxTriviaList;
        private _text: string;
        private _value: any;
        private _valueText: string;
        private _trailingTrivia: ISyntaxTriviaList;
        private _isMissing: bool;

        constructor(tokenKind: SyntaxKind,
                    keywordKind: SyntaxKind,
                    fullStart: number,
                    leadingTrivia: ISyntaxTriviaList,
                    text: string,
                    value: any,
                    valueText: string,
                    trailingTrivia: ISyntaxTriviaList,
                    isMissing: bool) {
            this.tokenKind = tokenKind;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._leadingTrivia = leadingTrivia;
            this._text = text;
            this._value = value;
            this._valueText = valueText;
            this._trailingTrivia = trailingTrivia;
            this._isMissing = isMissing;
        }

        public kind(): SyntaxKind { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return this._isMissing; }

        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this._leadingTrivia.fullWidth() + this.width() + this._trailingTrivia.fullWidth(); }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }

        public start(): number { return this.fullStart() + this._leadingTrivia.fullWidth(); }
        public width(): number { return this.text().length; }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(): string { return this._leadingTrivia.fullText() + this.text() + this._trailingTrivia.fullText(); }

        public value(): any { return this._value; }
        public valueText(): string { return this._valueText; }

        public hasLeadingTrivia(): bool { return this._leadingTrivia.count() > 0; }
        public hasLeadingCommentTrivia(): bool { return this._leadingTrivia.hasComment(); }
        public hasLeadingNewLineTrivia(): bool { return this._leadingTrivia.hasNewLine(); }

        public hasTrailingTrivia(): bool { return this._trailingTrivia.count() > 0; }
        public hasTrailingCommentTrivia(): bool { return this._trailingTrivia.hasComment(); }
        public hasTrailingNewLineTrivia(): bool { return this._trailingTrivia.hasNewLine(); }

        public leadingTrivia(): ISyntaxTriviaList { return this._leadingTrivia; }
        public trailingTrivia(): ISyntaxTriviaList { return this._trailingTrivia; }

        public realize(): ISyntaxToken { return this; }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withFullStart(fullStart: number): ISyntaxToken {
            return new RealizedToken(
                this.tokenKind, this._keywordKind,
                fullStart,
                this._leadingTrivia, this._text, this._value,
                this._valueText, this._trailingTrivia, this._isMissing);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return new RealizedToken(
                this.tokenKind, this._keywordKind, this._fullStart,
                leadingTrivia, this._text, this._value,
                this._valueText, this._trailingTrivia, this._isMissing);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return new RealizedToken(
                this.tokenKind, this._keywordKind, this._fullStart,
                this._leadingTrivia, this._text, this._value,
                this._valueText, trailingTrivia, this._isMissing);
        }
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