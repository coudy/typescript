///<reference path='References.ts' />

module SyntaxToken {
    class VariableWidthTokenWithNoTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _value: any;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, text: string, value: any) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithNoTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._text,
                this._value);
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

        public fullWidth(): number { return this.width(); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class VariableWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _text: string;
        private _value: any;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, text: string, value: any) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._text = text;
            this._value = value;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._text,
                this._value);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class VariableWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _value: any;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, text: string, value: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._value = value;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._text,
                this._value,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class VariableWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _text: string;
        private _value: any;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, text: string, value: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._text = text;
            this._value = value;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._text,
                this._value,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return this._text; }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return value(this, this._value); }
        public valueText(): string { return valueText(this); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class FixedWidthTokenWithNoTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithNoTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart);
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

        public fullWidth(): number { return this.width(); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class FixedWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithLeadingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class FixedWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class FixedWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class KeywordWithNoTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;

        constructor(sourceText: IText, keywordKind: SyntaxKind, fullStart: number) {
            this._sourceText = sourceText;
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
        }

        public clone(): ISyntaxToken {
            return new KeywordWithNoTrivia(
                this._sourceText,
                this._keywordKind,
                this._fullStart);
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

        public fullWidth(): number { return this.width(); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class KeywordWithLeadingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(sourceText: IText, keywordKind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new KeywordWithLeadingTrivia(
                this._sourceText,
                this._keywordKind,
                this._fullStart,
                this._leadingTriviaInfo);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class KeywordWithTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, keywordKind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new KeywordWithTrailingTrivia(
                this._sourceText,
                this._keywordKind,
                this._fullStart,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart; }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }

    class KeywordWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, keywordKind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new KeywordWithLeadingAndTrailingTrivia(
                this._sourceText,
                this._keywordKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._trailingTriviaInfo);
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

        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width() + getTriviaLength(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        private end(): number { return this.start() + this.width(); }

        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth()); }

        public value(): any { return null; }
        public valueText(): string { return null; }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTriviaWidth(): number { return getTriviaLength(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaLength(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTriviaWidth(): number { return getTriviaLength(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaLength(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public toJSON(key) { return toJSON(this); }
        public realize(): ISyntaxToken { return realize(this); }
        public collectTextElements(elements: string[]): void { collectTextElements(this, elements); }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }
    }


    function createFixedWidthToken(sourceText: IText, fullStart: number,
        leadingTriviaInfo: number,
        kind: SyntaxKind,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(sourceText, kind, fullStart);
            }
            else {
                return new FixedWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new FixedWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo);
        }
        else {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
        }
    }

    function createVariableWidthToken(sourceText: IText, fullStart: number,
        leadingTriviaInfo: number,
        tokenInfo: ScannerTokenInfo,
        trailingTriviaInfo: number): ISyntaxToken {

        var kind = tokenInfo.Kind;
        // var text = tokenInfo.Text === null ? SyntaxFacts.getText(kind) : tokenInfo.Text;
        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(sourceText, kind, fullStart, tokenInfo.Text, tokenInfo.Value);
            }
            else {
                return new VariableWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, tokenInfo.Text, tokenInfo.Value, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, tokenInfo.Text, tokenInfo.Value);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, tokenInfo.Text, tokenInfo.Value, trailingTriviaInfo);
        }
    }

    function createKeyword(sourceText: IText, fullStart: number,
        leadingTriviaInfo: number,
        keywordKind: SyntaxKind,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new KeywordWithNoTrivia(sourceText, keywordKind, fullStart);
            }
            else {
                return new KeywordWithTrailingTrivia(sourceText, keywordKind, fullStart, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new KeywordWithLeadingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo);
        }
        else {
            return new KeywordWithLeadingAndTrailingTrivia(sourceText, keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
        }
    }

    export function create(text: IText, fullStart: number,
        leadingTriviaInfo: number,
        tokenInfo: ScannerTokenInfo,
        trailingTriviaInfo: number): ISyntaxToken {
        if (SyntaxFacts.isAnyPunctuation(tokenInfo.Kind)) {
            return createFixedWidthToken(text, fullStart, leadingTriviaInfo, tokenInfo.Kind, trailingTriviaInfo);
        }
        else if (SyntaxFacts.isAnyKeyword(tokenInfo.KeywordKind)) {
            return createKeyword(text, fullStart, leadingTriviaInfo, tokenInfo.KeywordKind, trailingTriviaInfo);
        }
        else {
            return createVariableWidthToken(text, fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo);
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