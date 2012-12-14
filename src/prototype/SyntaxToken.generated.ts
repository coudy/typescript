///<reference path='References.ts' />

module SyntaxToken {
    class VariableWidthTokenWithNoTrivia implements ISyntaxToken {
        private _sourceText: IText;
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _textOrWidth: any;
        private _value: any = null;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, textOrWidth: any) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._textOrWidth = textOrWidth;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithNoTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._textOrWidth);
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
        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }
        private end(): number { return this.start() + this.width(); }


        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierNameToken);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return this._value || (this._value = value(this)); }
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
        private _textOrWidth: any;
        private _value: any = null;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, textOrWidth: any) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._textOrWidth);
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
        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }
        private end(): number { return this.start() + this.width(); }


        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierNameToken);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return this._value || (this._value = value(this)); }
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
        private _textOrWidth: any;
        private _value: any = null;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, textOrWidth: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._textOrWidth,
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
        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }
        private end(): number { return this.start() + this.width(); }


        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierNameToken);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return this._value || (this._value = value(this)); }
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
        private _textOrWidth: any;
        private _value: any = null;
        private _trailingTriviaInfo: number;

        constructor(sourceText: IText, kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, textOrWidth: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(
                this._sourceText,
                this.tokenKind,
                this._fullStart,
                this._leadingTriviaInfo,
                this._textOrWidth,
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
        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }
        private end(): number { return this.start() + this.width(); }


        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierNameToken);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return this._value || (this._value = value(this)); }
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
        public tokenKind: SyntaxKind;
        private _fullStart: number;

        constructor(kind: SyntaxKind, fullStart: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithNoTrivia(
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
        public fullText(): string { return this.text(); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        public tokenKind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;

        constructor(keywordKind: SyntaxKind, fullStart: number) {
            this.tokenKind = SyntaxKind.IdentifierNameToken;
            this._keywordKind = keywordKind;
            this._fullStart = fullStart;
        }

        public clone(): ISyntaxToken {
            return new KeywordWithNoTrivia(
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
        public fullText(): string { return this.text(); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return null; }
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
        kind: SyntaxKind,
        leadingTriviaInfo: number,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(kind, fullStart);
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
        kind: SyntaxKind,
        leadingTriviaInfo: number,
        width: number,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(sourceText, kind, fullStart, width);
            }
            else {
                return new VariableWidthTokenWithTrailingTrivia(sourceText, kind, fullStart, width, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, width);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, kind, fullStart, leadingTriviaInfo, width, trailingTriviaInfo);
        }
    }

    function createKeyword(sourceText: IText, fullStart: number,
        keywordKind: SyntaxKind,
        leadingTriviaInfo: number,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new KeywordWithNoTrivia(keywordKind, fullStart);
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
        kind: SyntaxKind,
        leadingTriviaInfo: number,
        width: number,
        trailingTriviaInfo: number): ISyntaxToken {
        if (SyntaxFacts.isAnyPunctuation(kind)) {
            return createFixedWidthToken(text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);
        }
        else if (SyntaxFacts.isAnyKeyword(kind)) {
            return createKeyword(text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);
        }
        else {
            return createVariableWidthToken(text, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);
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