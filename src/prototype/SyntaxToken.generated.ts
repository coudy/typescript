///<reference path='References.ts' />

module SyntaxToken {
    class VariableWidthTokenWithNoTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _value: any;

        constructor(kind: SyntaxKind, fullStart: number, text: string, value: any) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class VariableWidthTokenWithLeadingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _text: string;
        private _value: any;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, text: string, value: any) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._text = text;
            this._value = value;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class VariableWidthTokenWithTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _value: any;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, text: string, value: any, trailingTriviaInfo: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class VariableWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _text: string;
        private _value: any;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, text: string, value: any, trailingTriviaInfo: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._text = text;
            this._value = value;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class FixedWidthTokenWithNoTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;

        constructor(kind: SyntaxKind, fullStart: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class FixedWidthTokenWithLeadingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class FixedWidthTokenWithTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class FixedWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class KeywordWithNoTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;

        constructor(keywordKind: SyntaxKind, fullStart: number) {
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return SyntaxKind.IdentifierNameToken; }
        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class KeywordWithLeadingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(keywordKind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return SyntaxKind.IdentifierNameToken; }
        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class KeywordWithTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(keywordKind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return SyntaxKind.IdentifierNameToken; }
        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }

    class KeywordWithLeadingAndTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(keywordKind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public isToken(): bool { return true; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public isMissing(): bool { return false; }

        public kind(): SyntaxKind { return SyntaxKind.IdentifierNameToken; }
        public keywordKind(): SyntaxKind { return this._keywordKind; }

        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return this.fullStart() + this.fullWidth(); }
        public end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.fullStart(), getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return Scanner.scanTrivia(text, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this, /*includeRealTrivia:*/ false); }
        public realize(text: IText): ISyntaxToken { return realize(this, text); }
        public collectTextElements(text: IText, elements: string[]): void { collectTextElements(this, text, elements); }
    }


    function createFixedWidthToken(fullStart: number,
        leadingTriviaInfo: number,
        kind: SyntaxKind,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(kind, fullStart);
            }
            else {
                return new FixedWidthTokenWithTrailingTrivia(kind, fullStart, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new FixedWidthTokenWithLeadingTrivia(kind, fullStart, leadingTriviaInfo);
        }
        else {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
        }
    }

    function createVariableWidthToken(fullStart: number,
        leadingTriviaInfo: number,
        tokenInfo: ScannerTokenInfo,
        trailingTriviaInfo: number): ISyntaxToken {

        var kind = tokenInfo.Kind;
        var text = tokenInfo.Text === null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(kind, fullStart, text, tokenInfo.Value);
            }
            else {
                return new VariableWidthTokenWithTrailingTrivia(kind, fullStart, text, tokenInfo.Value, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(kind, fullStart, leadingTriviaInfo, text, tokenInfo.Value);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, leadingTriviaInfo, text, tokenInfo.Value, trailingTriviaInfo);
        }
    }

    function createKeyword(fullStart: number,
        leadingTriviaInfo: number,
        keywordKind: SyntaxKind,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new KeywordWithNoTrivia(keywordKind, fullStart);
            }
            else {
                return new KeywordWithTrailingTrivia(keywordKind, fullStart, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new KeywordWithLeadingTrivia(keywordKind, fullStart, leadingTriviaInfo);
        }
        else {
            return new KeywordWithLeadingAndTrailingTrivia(keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
        }
    }

    export function create(fullStart: number,
        leadingTriviaInfo: number,
        tokenInfo: ScannerTokenInfo,
        trailingTriviaInfo: number): ISyntaxToken {
        if (SyntaxFacts.isAnyPunctuation(tokenInfo.Kind)) {
            return createFixedWidthToken(fullStart, leadingTriviaInfo, tokenInfo.Kind, trailingTriviaInfo);
        }
        else if (SyntaxFacts.isAnyKeyword(tokenInfo.KeywordKind)) {
            return createKeyword(fullStart, leadingTriviaInfo, tokenInfo.KeywordKind, trailingTriviaInfo);
        }
        else {
            return createVariableWidthToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo);
        }
    }

    function getTriviaLength(value: number) {
        return value & Constants.TriviaLengthMask;
    }

    function hasTriviaComment(value: number): bool {
        return (value & Constants.TriviaCommentMask) !== 0;
    }

    function hasTriviaNewLine(value: number): bool {
        return (value & Constants.TriviaNewLineMask) !== 0;
    }
}