///<reference path='ISyntaxToken.ts' />
///<reference path='Hash.ts' />
///<reference path='Scanner.ts' />

module SyntaxToken {
    export function hashCode(token: ISyntaxToken): number {
        var hash = 0;

        hash = Hash.combine(token.leadingTriviaWidth(), hash);
        hash = Hash.combine(token.hasLeadingCommentTrivia ? 1 : 0, hash);
        hash = Hash.combine(token.hasLeadingNewLineTrivia ? 1 : 0, hash);

        hash = Hash.combine(token.kind(), hash);
        hash = Hash.combine(token.keywordKind(), hash);
        hash = Hash.combine(Hash.computeSimple31BitStringHashCode(token.text()), hash);

        hash = Hash.combine(token.trailingTriviaWidth(), hash);
        hash = Hash.combine(token.hasTrailingCommentTrivia ? 1 : 0, hash);
        hash = Hash.combine(token.hasTrailingNewLineTrivia ? 1 : 0, hash);

        return hash;
    }

    export function realize(token: ISyntaxToken): ISyntaxToken {
        return new RealizedToken(token.tokenKind, token.keywordKind(),
            token.leadingTrivia(), token.text(), token.value(), token.trailingTrivia(),
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

        result.width = token.width();
        if (token.fullWidth() !== token.width()) {
            result.fullWidth = token.fullWidth();
        }

        if (token.isMissing()) {
            result.isMissing = true;
        }

        result.text = token.text();

        if (token.value() !== null) {
            result.valueText = token.value();
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

    export function value(token: ISyntaxToken): any {
        if (token.tokenKind === SyntaxKind.IdentifierNameToken) {
            var text = token.text();
            for (var i = 0; i < text.length; i++) {
                // TODO: handle unicode and escapes.
                if (!Scanner.isIdentifierPartCharacter[text.charCodeAt(i)]) {
                    return null;
                }
            }

            return text;
        }
        else if (token.tokenKind === SyntaxKind.NumericLiteral) {
            // TODO: implement this.
            return null;
        }
        else if (token.tokenKind === SyntaxKind.StringLiteral) {
            // TODO: implement this.
            return null;
        }
        else if (token.tokenKind === SyntaxKind.RegularExpressionLiteral) {
            // TODO: implement this.
            return null;
        }
        else if (token.tokenKind === SyntaxKind.EndOfFileToken || token.tokenKind === SyntaxKind.ErrorToken) {
            return null;
        }
        else {
            throw Errors.invalidOperation();
        }
    }

    //export function valueText(token: ISyntaxToken): string {
    //    // TODO: specialize on IdentifierName token with null value.  In that case we need to 
    //    // process the escape codes and make a real value for this token.  Remember, don't do
    //    // this for keywords.

    //    var value = token.value();
    //    return value === null
    //        ? null
    //        : typeof value === 'string'
    //            ? value
    //            : value.toString();
    //}

    class EmptyToken implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;

        constructor(kind: SyntaxKind, keywordKind: SyntaxKind) {
            this.tokenKind = kind;
            this._keywordKind = keywordKind;
        }

        public clone(): ISyntaxToken {
            return new EmptyToken(this.tokenKind, this._keywordKind);
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
        public fullWidth() { return 0; }
        public width() { return 0; }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(): string { return ""; }
        public value() { return null; }
        public hasLeadingTrivia() { return false; }
        public hasLeadingCommentTrivia() { return false; }
        public hasLeadingNewLineTrivia() { return false; }
        public leadingTriviaWidth() { return 0; }
        public hasTrailingTrivia() { return false; }
        public hasTrailingCommentTrivia() { return false; }
        public hasTrailingNewLineTrivia() { return false; }
        public trailingTriviaWidth() { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }

        public withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }
    }

    export function createEmpty(kind: SyntaxKind, keywordKind: SyntaxKind): ISyntaxToken {
        return new EmptyToken(kind, keywordKind);
    }

    class RealizedToken implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _leadingTrivia: ISyntaxTriviaList;
        private _text: string;
        private _value: any;
        private _trailingTrivia: ISyntaxTriviaList;
        private _isMissing: bool;

        constructor(tokenKind: SyntaxKind,
                    keywordKind: SyntaxKind,
                    leadingTrivia: ISyntaxTriviaList,
                    text: string,
                    value: any,
                    trailingTrivia: ISyntaxTriviaList,
                    isMissing: bool) {
            this.tokenKind = tokenKind;
            this._keywordKind = keywordKind;
            this._leadingTrivia = leadingTrivia;
            this._text = text;
            this._value = value;
            this._trailingTrivia = trailingTrivia;
            this._isMissing = isMissing;
        }

        public clone(): ISyntaxToken {
            return new RealizedToken(this.tokenKind, this._keywordKind, this._leadingTrivia,
                this._text, this._value, this._trailingTrivia, this._isMissing);
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

        public fullWidth(): number { return this._leadingTrivia.fullWidth() + this.width() + this._trailingTrivia.fullWidth(); }
        public width(): number { return this.text().length; }

        public text(): string { return this._text; }
        public fullText(): string { return this._leadingTrivia.fullText() + this.text() + this._trailingTrivia.fullText(); }

        public value(): any { return this._value; }

        public hasLeadingTrivia(): bool { return this._leadingTrivia.count() > 0; }
        public hasLeadingCommentTrivia(): bool { return this._leadingTrivia.hasComment(); }
        public hasLeadingNewLineTrivia(): bool { return this._leadingTrivia.hasNewLine(); }
        public leadingTriviaWidth(): number { return this._leadingTrivia.fullWidth(); }

        public hasTrailingTrivia(): bool { return this._trailingTrivia.count() > 0; }
        public hasTrailingCommentTrivia(): bool { return this._trailingTrivia.hasComment(); }
        public hasTrailingNewLineTrivia(): bool { return this._trailingTrivia.hasNewLine(); }
        public trailingTriviaWidth(): number { return this._trailingTrivia.fullWidth(); }

        public leadingTrivia(): ISyntaxTriviaList { return this._leadingTrivia; }
        public trailingTrivia(): ISyntaxTriviaList { return this._trailingTrivia; }

        public realize(): ISyntaxToken { return this; }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return new RealizedToken(
                this.tokenKind, this._keywordKind,
                leadingTrivia, this._text, this._value,
                this._trailingTrivia, this._isMissing);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return new RealizedToken(
                this.tokenKind, this._keywordKind,
                this._leadingTrivia, this._text, this._value,
                trailingTrivia, this._isMissing);
        }
    }

    export function create(kind: SyntaxKind, token: ITokenInfo = null): ISyntaxToken {
        var text = (token !== null && token.text) ? token.text : SyntaxFacts.getText(kind);
        var value = (token !== null && token.value) ? token.value : null;
        
        var keywordKind = SyntaxKind.None;
        if (SyntaxFacts.isAnyKeyword(kind)) {
            keywordKind = kind;
            kind = SyntaxKind.IdentifierNameToken;
        }

        return new RealizedToken(
            kind,
            keywordKind,
            SyntaxTriviaList.create(token === null ? null : token.leadingTrivia),
            text,
            value,
            SyntaxTriviaList.create(token === null ? null : token.trailingTrivia),
            /*isMissing:*/ false);
    }
}