///<reference path='References.ts' />

module SyntaxTokenFactory {
    function getTriviaLength(value: number) {
        return value & Constants.TriviaLengthMask;
    }

    function hasTriviaComment(value: number): bool {
        return (value & Constants.TriviaCommentMask) !== 0;
    }

    function hasTriviaNewLine(value: number): bool {
        return (value & Constants.TriviaNewLineMask) !== 0;
    }

    function toJSON(token: ISyntaxToken) {
        var result: any = {
            kind: (<any>SyntaxKind)._map[token.kind]
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

    class EmptyToken implements ISyntaxToken {
        public kind: SyntaxKind;
        private _keywordKind: SyntaxKind;

        constructor(kind: SyntaxKind, keywordKind: SyntaxKind) {
            this.kind = kind;
            this._keywordKind = keywordKind;
        }
        
        public toJSON(key) { return toJSON(this); }
        public keywordKind() { return this._keywordKind; }
        public fullStart() { return 0; }
        public fullWidth() { return 0; }
        public start() { return 0; }
        public width() { return 0; }
        public isMissing() { return true; }
        public text() { return ""; }
        public fullText(itext: IText): string { return ""; }
        public value() { return null; }
        public valueText() { return ""; }
        public diagnostics(): SyntaxDiagnostic[] { return []; }
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
        public kind: SyntaxKind;
        private _fullStart: number;

        constructor(kind: SyntaxKind, fullStart: number) {
            this.kind = kind;
            this._fullStart = fullStart;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.kind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.kind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, trailingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.kind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.kind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public kind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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

        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public kind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public kind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public kind: SyntaxKind = SyntaxKind.IdentifierNameToken;
        public keywordKind(): SyntaxKind { return this._keywordKind; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this._keywordKind); }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _text: string;

        constructor(kind: SyntaxKind, fullStart: number, text: string) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width(); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return this._text; }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _leadingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, text: string, leadingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }

        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.width(); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return this._text; }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, text: string, trailingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return this.width() + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart(); }
        public width(): number { return this.text().length; }
        public text(): string { return this._text; }
        public value(): any { return null; }
        public valueText(): string { return null; }
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
        public kind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind, fullStart: number, text: string, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this.kind = kind;
            this._fullStart = fullStart;
            this._text = text;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public toJSON(key) { return toJSON(this); }
        
        public isMissing(): bool { return false; }
        public diagnostics(): SyntaxDiagnostic[] { return null; }
        public keywordKind(): SyntaxKind { return SyntaxKind.None; }
        public fullStart(): number { return this._fullStart; }
        public fullWidth(): number { return getTriviaLength(this._leadingTriviaInfo) + this.text().length + getTriviaLength(this._trailingTriviaInfo); }
        public start(): number { return this.fullStart() + getTriviaLength(this._leadingTriviaInfo); }
        public width(): number { return this.text().length; }
        public text(): string { return this._text; }
        public value(): any { return null; }
        public valueText(): string { return null; }
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

    class FullToken implements ISyntaxToken {
        public kind: SyntaxKind;
        private _keywordKind: SyntaxKind;
        private _fullStart: number;
        private _text: string;
        private _diagnostics: Diagnostic[];
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(kind: SyntaxKind,
            keywordKind: SyntaxKind,
            text: string,
            fullStart: number,
            leadingTriviaInfo: number,
            trailingTriviaInfo: number,
            diagnostics: Diagnostic[]) {
            this.kind = kind;
            this._keywordKind = keywordKind;
            this._text = text;
            this._fullStart = fullStart;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
            this._diagnostics = diagnostics;
        }

        public toJSON(key) { return toJSON(this); }

        public keywordKind() { return this._keywordKind; }

        public fullStart() { return this._fullStart; }
        public fullWidth() { return getTriviaLength(this._leadingTriviaInfo) + this._text.length + getTriviaLength(this._trailingTriviaInfo); }

        public start() { return this._fullStart + getTriviaLength(this._leadingTriviaInfo); }
        public width() { return this._text.length; }

        public isMissing() { return false; }
        public text() { return this._text; }
        public fullText(text: IText): string { return text.substr(this.fullStart(), this.fullWidth()); }

        public value(): string {
            // TODO: return proper value here.
            return null;
        }

        public valueText(): string {
            // TODO: return proper value here.
            return null;
        }

        public diagnostics() { return this._diagnostics; }

        public hasLeadingTrivia() { return getTriviaLength(this._leadingTriviaInfo) > 0; }
        public hasLeadingCommentTrivia() { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLineTrivia() { return hasTriviaNewLine(this._leadingTriviaInfo); }

        public hasTrailingTrivia() { return getTriviaLength(this._trailingTriviaInfo) > 0; }
        public hasTrailingCommentTrivia() { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLineTrivia() { return hasTriviaNewLine(this._trailingTriviaInfo); }

        public leadingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }

        public trailingTrivia(text: IText): ISyntaxTriviaList { throw Errors.notYetImplemented(); }
    }

    export function create(fullStart: number,
                         leadingTriviaInfo: number,
                         tokenInfo: ScannerTokenInfo,
                         trailingTriviaInfo: number,
                         diagnostics: Diagnostic[]): ISyntaxToken {
        // if (false) {
            if (diagnostics === null || diagnostics.length === 0) {
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
        // }

        // TODO: use a more efficient implementation for when there is no trivia, or the kind is
        // one of the well known types.
        // return new SimpleSyntaxToken(tokenInfo.Kind, tokenInfo.KeywordKind, trailingTriviaInfo.HasNewLine);
        return createFullToken(fullStart, leadingTriviaInfo, tokenInfo, trailingTriviaInfo, diagnostics);
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
                return new VariableWidthTokenWithNoTrivia(kind, fullStart, text);
            }
            else {
                return new VariableWidthTokenWithTrailingTrivia(kind, fullStart, text, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(kind, fullStart, text, leadingTriviaInfo);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(kind, fullStart, text, leadingTriviaInfo, trailingTriviaInfo);
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

    function createFullToken(fullStart: number,
                             leadingTriviaInfo: number,
                             tokenInfo: ScannerTokenInfo,
                             trailingTriviaInfo: number,
                             diagnostics: Diagnostic[]): ISyntaxToken {
        // Debug.assert(tokenInfo.Text !== null);
        var text = tokenInfo.Text || SyntaxFacts.getText(tokenInfo.Kind);
        return new FullToken(tokenInfo.Kind, tokenInfo.KeywordKind, tokenInfo.Text, fullStart,
            leadingTriviaInfo, trailingTriviaInfo, diagnostics);
    }
    
    export function createEmptyToken(kind: SyntaxKind, keywordKind: SyntaxKind): ISyntaxToken {
            // TODO: This needs to take in the proper position.
        return new EmptyToken(kind, keywordKind);
    }
}