///<reference path='References.ts' />

module SyntaxToken {
    function getTriviaLength(value: number) {
        return value & Constants.TriviaLengthMask;
    }

    function hasTriviaComment(value: number): bool {
        return (value & Constants.TriviaCommentMask) !== 0;
    }

    function hasTriviaNewLine(value: number): bool {
        return (value & Constants.TriviaNewLineMask) !== 0;
    }

    function fullEnd(token: ISyntaxToken): number {
        return token.fullStart() + token.fullWidth();
    }

    function end(token: ISyntaxToken): number {
        return token.start() + token.width();
    }

    function toJSON(token: ISyntaxToken) {
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

        return result;
    }

    function toValueString(token: ISyntaxToken): string {
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
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }

        public toJSON(key) { return toJSON(this); }
        public keywordKind() { return this._keywordKind; }
        public fullStart() { return this._fullStart; }
        public fullWidth() { return 0; }
        public start() { return this._fullStart; }
        public width() { return 0; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(itext: IText): string { return ""; }
        public value() { return null; }
        public valueText(): string { return toValueString(this); }
        public hasLeadingTrivia() { return false; }
        public hasLeadingCommentTrivia() { return false; }
        public hasLeadingNewLineTrivia() { return false; }
        public hasTrailingTrivia() { return false; }
        public hasTrailingCommentTrivia() { return false; }
        public hasTrailingNewLineTrivia() { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
    }

    class FixedWidthTokenWithNoTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;

        constructor(kind: SyntaxKind, fullStart: number) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return this.text(); }
        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
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
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
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
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
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
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
    }

    class FixedWidthKeywordWithNoTrivia implements ISyntaxToken {
        private _keywordKind: SyntaxKind;
        private _fullStart: number;

        constructor(kind: SyntaxKind, fullStart: number) {
            this._keywordKind = kind;
            this._fullStart = fullStart;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return SyntaxKind.IdentifierNameToken; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public tokenKind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return this.text(); }
        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
    }

    class FixedWidthKeywordWithLeadingTrivia implements ISyntaxToken {
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return SyntaxKind.IdentifierNameToken; }
        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public tokenKind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
    }

    class FixedWidthKeywordWithTrailingTrivia implements ISyntaxToken {
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return SyntaxKind.IdentifierNameToken; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public tokenKind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
    }

    class FixedWidthKeywordWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this._keywordKind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return SyntaxKind.IdentifierNameToken; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public tokenKind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
    }

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
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return this._text; }
        public value(): any { return this._value; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return this.text(); }
        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
    }

    class VariableWidthTokenWithLeadingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _leadingTriviaInfo: number;
        private _value: any;

        constructor(kind: SyntaxKind, fullStart: number, text: string, leadingTriviaInfo: number, value: any) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._value = value;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return this._text; }
        public value(): any { return this._value; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return false; }
        public hasTrailingCommentTrivia(): bool { return false; }
        public hasTrailingNewLineTrivia(): bool { return false; }
        public trailingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }
    }

    class VariableWidthTokenWithTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _trailingTriviaInfo: number;
        private _value: any;

        constructor(kind: SyntaxKind, fullStart: number, text: string, trailingTriviaInfo: number, value: any) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return this._text; }
        public value(): any { return this._value; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return false; }
        public hasLeadingCommentTrivia(): bool { return false; }
        public hasLeadingNewLineTrivia(): bool { return false; }
        public leadingTrivia(text: IText): ISyntaxTriviaList { return SyntaxTriviaList.empty; }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
    }

    class VariableWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;
        private _value: any;

        constructor(kind: SyntaxKind, fullStart: number, text: string, leadingTriviaInfo: number, trailingTriviaInfo: number, value: any) {
            this.tokenKind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._value = value;
        }
        
        public isToken(): bool { return true; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return false; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public kind() { return this.tokenKind; }
        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public fullEnd(): number { return fullEnd(this); }
        public end(): number { return end(this); }
        public text(): string { return this._text; }
        public value(): any { return this._value; }
        public valueText(): string { return toValueString(this); }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public hasLeadingTrivia(): bool { return true; }
        public hasLeadingCommentTrivia(): bool { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia(): bool { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public hasTrailingTrivia(): bool { return true; }
        public hasTrailingCommentTrivia(): bool { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia(): bool { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
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
                return new VariableWidthTokenWithTrailingTrivia(kind, fullStart, text, trailingTriviaInfo, tokenInfo.Value);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(kind, fullStart, text, leadingTriviaInfo, tokenInfo.Value);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, text, leadingTriviaInfo, trailingTriviaInfo, tokenInfo.Value);
        }
    }

    function createFixedWidthKeyword(fullStart: number,
        leadingTriviaInfo: number,
        keywordKind: SyntaxKind,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new FixedWidthKeywordWithNoTrivia(keywordKind, fullStart);
            }
            else {
                return new FixedWidthKeywordWithTrailingTrivia(keywordKind, fullStart, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new FixedWidthKeywordWithLeadingTrivia(keywordKind, fullStart, leadingTriviaInfo);
        }
        else {
            return new FixedWidthKeywordWithLeadingAndTrailingTrivia(keywordKind, fullStart, leadingTriviaInfo, trailingTriviaInfo);
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
            return createFixedWidthKeyword(fullStart, leadingTriviaInfo, tokenInfo.KeywordKind, trailingTriviaInfo);
        }
        else {
            return createVariableWidthToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo);
        }
    }
    
    export function createEmpty(fullStart: number, kind: SyntaxKind, keywordKind: SyntaxKind): ISyntaxToken {
        return new EmptyToken(fullStart, kind, keywordKind);
    }

    //export function createElastic(kind: SyntaxKind, keywordKind = SyntaxKind.None, leadingTrivia = SyntaxTriviaList.empty, text = null, trailingTrivia = SyntaxTriviaList.empty): ISyntaxToken {
    //    if (text === null) {
    //        text = keywordKind !== SyntaxKind.None ? SyntaxFacts.getText(keywordKind) : SyntaxFacts.getText(kind);
    //    }
    //}

    //export function createElasticWithLeadingTrivia(leadingTrivia: ISyntaxTriviaList, kind: SyntaxKind, keywordKind = SyntaxKind.None, text = null, trailingTrivia = SyntaxTriviaList.empty): ISyntaxToken {
    //    return createElastic(kind, keywordKind, leadingTrivia, text, trailingTrivia);
    //}

    //export function createElasticWithTrailingTrivia(kind: SyntaxKind, keywordKind = SyntaxKind.None, trailingTrivia = SyntaxTriviaList.empty. leadingTrivia: ISyntaxTriviaList, text = null): ISyntaxToken {
    //    return createElastic(kind, keywordKind, leadingTrivia, text, trailingTrivia);
    //}
}