///<reference path='ISyntaxToken.ts' />
///<reference path='Hash.ts' />
///<reference path='Scanner.ts' />

module Syntax {
    export function tokenHashCode(token: ISyntaxToken): number {
        var hash = 0;

        hash = Hash.combine(token.leadingTriviaWidth(), hash);
        hash = Hash.combine(token.hasLeadingComment() ? 1 : 0, hash);
        hash = Hash.combine(token.hasLeadingNewLine() ? 1 : 0, hash);
        hash = Hash.combine(token.hasLeadingSkippedText() ? 1 : 0, hash);

        hash = Hash.combine(token.kind(), hash);
        hash = Hash.combine(token.keywordKind(), hash);
        hash = Hash.combine(Hash.computeSimple31BitStringHashCode(token.text()), hash);

        hash = Hash.combine(token.trailingTriviaWidth(), hash);
        hash = Hash.combine(token.hasTrailingComment() ? 1 : 0, hash);
        hash = Hash.combine(token.hasTrailingNewLine() ? 1 : 0, hash);
        hash = Hash.combine(token.hasTrailingSkippedText() ? 1 : 0, hash);

        return hash;
    }

    export function realize(token: ISyntaxToken): ISyntaxToken {
        return new RealizedToken(token.tokenKind, token.keywordKind(),
            token.leadingTrivia(), token.text(), token.value(), token.trailingTrivia(),
            token.isMissing());
    }

    export function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {
        token.leadingTrivia().collectTextElements(elements);
        elements.push(token.text());
        token.trailingTrivia().collectTextElements(elements);
    }

    export function tokenToJSON(token: ISyntaxToken) {
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

        if (token.hasLeadingComment()) {
            result.hasLeadingCommentTrivia = true;
        }

        if (token.hasLeadingNewLine()) {
            result.hasLeadingNewLineTrivia = true;
        }

        if (token.hasLeadingSkippedText()) {
            result.hasLeadingSkippedTextTrivia = true;
        }

        if (token.hasTrailingTrivia()) {
            result.hasTrailingTrivia = true;
        }

        if (token.hasTrailingComment()) {
            result.hasTrailingCommentTrivia = true;
        }

        if (token.hasTrailingNewLine()) {
            result.hasTrailingNewLineTrivia = true;
        }

        if (token.hasTrailingSkippedText()) {
            result.hasTrailingSkippedTextTrivia = true;
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

        public toJSON(key) { return tokenToJSON(this); }
        public keywordKind() { return this._keywordKind; }
        public fullWidth() { return 0; }
        public width() { return 0; }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(): string { return ""; }
        public value() { return null; }

        public hasLeadingTrivia() { return false; }
        public hasLeadingComment() { return false; }
        public hasLeadingNewLine() { return false; }
        public hasLeadingSkippedText() { return false; }
        public leadingTriviaWidth() { return 0; }
        public hasTrailingTrivia() { return false; }
        public hasTrailingComment() { return false; }
        public hasTrailingNewLine() { return false; }
        public hasTrailingSkippedText() { return false; }
        public hasSkippedText() { return false; }

        public trailingTriviaWidth() { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }
        public trailingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }

        public withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            throw Errors.invalidOperation('Can not call on a non-realized token.');
        }
    }

    export function emptyToken(kind: SyntaxKind, keywordKind: SyntaxKind): ISyntaxToken {
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
        public toJSON(key) { return tokenToJSON(this); }

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
        public hasLeadingComment(): bool { return this._leadingTrivia.hasComment(); }
        public hasLeadingNewLine(): bool { return this._leadingTrivia.hasNewLine(); }
        public hasLeadingSkippedText(): bool { return this._leadingTrivia.hasSkippedText(); }
        public leadingTriviaWidth(): number { return this._leadingTrivia.fullWidth(); }

        public hasTrailingTrivia(): bool { return this._trailingTrivia.count() > 0; }
        public hasTrailingComment(): bool { return this._trailingTrivia.hasComment(); }
        public hasTrailingNewLine(): bool { return this._trailingTrivia.hasNewLine(); }
        public hasTrailingSkippedText(): bool { return this._trailingTrivia.hasSkippedText(); }
        public trailingTriviaWidth(): number { return this._trailingTrivia.fullWidth(); }

        public hasSkippedText(): bool { return this.hasLeadingSkippedText() || this.hasTrailingSkippedText(); }

        public leadingTrivia(): ISyntaxTriviaList { return this._leadingTrivia; }
        public trailingTrivia(): ISyntaxTriviaList { return this._trailingTrivia; }

        public realize(): ISyntaxToken { return this; }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

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

    export function token(kind: SyntaxKind, info: ITokenInfo = null): ISyntaxToken {
        var text = (info !== null && info.text) ? info.text : SyntaxFacts.getText(kind);
        var value = (info !== null && info.value) ? info.value : null;
        
        var keywordKind = SyntaxKind.None;
        if (SyntaxFacts.isAnyKeyword(kind)) {
            keywordKind = kind;
            kind = SyntaxKind.IdentifierNameToken;
        }

        return new RealizedToken(
            kind,
            keywordKind,
            Syntax.triviaList(info === null ? null : info.leadingTrivia),
            text,
            value,
            Syntax.triviaList(info === null ? null : info.trailingTrivia),
            /*isMissing:*/ false);
    }
    
    export function identifier(text: string, info: ITokenInfo = null): ISyntaxToken {
        info = info || {};
        info.text = text;
        return token(SyntaxKind.IdentifierNameToken, info);
    }
}