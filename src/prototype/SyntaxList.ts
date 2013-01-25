///<reference path='ISyntaxList.ts' />

module Syntax {
    class EmptySyntaxList implements ISyntaxList {
        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isNode(): bool { return false; }
        public isToken(): bool { return false; }
        public isList(): bool { return true; }
        public isSeparatedList(): bool { return false; }

        public toJSON(key) {
            return [];
        }

        public count(): number {
            return 0;
        }

        public itemAt(index: number): SyntaxNode {
            throw Errors.argumentOutOfRange("index");
        }

        private collectTextElements(elements: string[]): void {
        }

        public toArray(): SyntaxNode[] {
            return [];
        }

        public firstToken(): ISyntaxToken {
            return null;
        }

        public lastToken(): ISyntaxToken {
            return null;
        }

        public fullWidth(): number {
            return 0;
        }

        public width(): number {
            return 0;
        }

        public leadingTriviaWidth(): number {
            return 0;
        }

        public trailingTriviaWidth(): number {
            return 0;
        }

        public fullText(): string {
            return "";
        }

        public isTypeScriptSpecific(): bool {
            return false;
        }

        public hasSkippedText(): bool {
            return false;
        }

        public hasZeroWidthToken(): bool {
            return false;
        }

        public hasRegularExpressionToken(): bool {
            return false;
        }

        public findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            // This should never have been called on this list.  It has a 0 width, so the client 
            // should have skipped over this.
            throw Errors.invalidOperation();
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
        }
    }

    export var emptyList: ISyntaxList = new EmptySyntaxList();

    class SingletonSyntaxList implements ISyntaxList {
        private item: ISyntaxNodeOrToken;

        constructor(item: ISyntaxNodeOrToken) {
            this.item = item;
        }

        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return true; }
        public isSeparatedList(): bool { return false; }

        public toJSON(key) {
            return [this.item];
        }

        public count() {
            return 1;
        }

        public itemAt(index: number): ISyntaxNodeOrToken {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        private collectTextElements(elements: string[]): void {
            this.item.collectTextElements(elements);
        }

        public toArray(): ISyntaxNodeOrToken[] {
            return [this.item];
        }

        public firstToken(): ISyntaxToken {
            return this.item.firstToken();
        }

        public lastToken(): ISyntaxToken {
            return this.item.lastToken();
        }

        public fullWidth(): number {
            return this.item.fullWidth();
        }

        public width(): number {
            return this.item.width();
        }

        public leadingTriviaWidth(): number {
            return this.item.leadingTriviaWidth();
        }

        public trailingTriviaWidth(): number {
            return this.item.trailingTriviaWidth();
        }

        public fullText(): string {
            return this.item.fullText();
        }

        public isTypeScriptSpecific(): bool {
            return this.item.isTypeScriptSpecific();
        }

        public hasSkippedText(): bool {
            return this.item.hasSkippedText();
        }

        public hasZeroWidthToken(): bool {
            return this.item.hasZeroWidthToken();
        }

        public hasRegularExpressionToken(): bool {
            return this.item.hasRegularExpressionToken();
        }

        public findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            // Debug.assert(position >= 0 && position < this.item.fullWidth());
            return (<any>this.item).findTokenInternal(
                new PositionedList(parent, this, fullStart), position, fullStart);
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            array.splice(index, 0, this.item);
        }
    }

    class NormalSyntaxList implements ISyntaxList {
        private nodeOrTokens: ISyntaxNodeOrToken[];
        private _data: number = -1;

        constructor(nodeOrTokens: ISyntaxNodeOrToken[]) {
            this.nodeOrTokens = nodeOrTokens;
        }

        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isNode(): bool { return false; }
        public isToken(): bool { return false; }
        public isList(): bool { return true; }
        public isSeparatedList(): bool { return false; }

        public toJSON(key) {
            return this.nodeOrTokens;
        }

        public count() {
            return this.nodeOrTokens.length;
        }

        public itemAt(index: number): ISyntaxNodeOrToken {
            if (index < 0 || index >= this.nodeOrTokens.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodeOrTokens[index];
        }

        private collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var element = this.nodeOrTokens[i];
                element.collectTextElements(elements);
            }
        }

        public toArray(): ISyntaxNodeOrToken[] {
            return this.nodeOrTokens.slice(0);
        }

        public firstToken(): ISyntaxToken {
            for (var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var token = this.nodeOrTokens[i].firstToken();
                if (token !== null) {
                    return token;
                }
            }

            return null;
        }

        public lastToken(): ISyntaxToken {
            for (var i = this.nodeOrTokens.length - 1; i >= 0; i--) {
                var token = this.nodeOrTokens[i].lastToken();
                if (token !== null) {
                    return token;
                }
            }

            return null;
        }

        public fullText(): string {
            var elements: string[] = [];
            this.collectTextElements(elements);
            return elements.join("");
        }

        public isTypeScriptSpecific(): bool {
            for (var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                if (this.nodeOrTokens[i].isTypeScriptSpecific()) {
                    return true;
                }
            }

            return false;
        }

        public hasSkippedText(): bool {
            return (this.data() & Constants.NodeSkippedTextMask) !== 0;
        }

        public hasZeroWidthToken(): bool {
            return (this.data() & Constants.NodeZeroWidthTokenMask) !== 0;
        }

        public hasRegularExpressionToken(): bool {
            return (this.data() & Constants.NodeRegularExpressionTokenMask) !== 0;
        }

        public fullWidth(): number {
            return this.data() >>> Constants.NodeFullWidthShift;
        }

        public width(): number {
            var fullWidth = this.fullWidth();
            return fullWidth - this.leadingTriviaWidth() - this.trailingTriviaWidth();
        }

        public leadingTriviaWidth(): number {
            return this.firstToken().leadingTriviaWidth();
        }

        public trailingTriviaWidth(): number {
            return this.lastToken().trailingTriviaWidth();
        }

        private computeData(): number {
            var fullWidth = 0;
            var hasSkippedText = false;
            var hasZeroWidthToken = false;
            var hasRegularExpressionToken = false;

            for (var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var node = this.nodeOrTokens[i];
                fullWidth += node.fullWidth();
                hasSkippedText = hasSkippedText || node.hasSkippedText();
                hasZeroWidthToken = hasZeroWidthToken || node.hasZeroWidthToken();
                hasRegularExpressionToken = hasRegularExpressionToken || node.hasRegularExpressionToken();
            }

            return (fullWidth << Constants.NodeFullWidthShift)
                 | (hasSkippedText ? Constants.NodeSkippedTextMask : 0)
                 | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0)
                 | (hasRegularExpressionToken ? Constants.NodeRegularExpressionTokenMask : 0);
        }

        private data(): number {
            if (this._data === -1) {
                this._data = this.computeData();
            }

            return this._data;
        }

        public findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            // Debug.assert(position >= 0 && position < this.fullWidth());
            
            parent = new PositionedList(parent, this, fullStart);
            for (var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var nodeOrToken = this.nodeOrTokens[i];

                var childWidth = nodeOrToken.fullWidth();
                if (position < childWidth) {
                    return (<any>nodeOrToken).findTokenInternal(parent, position, fullStart);
                }

                position -= childWidth;
                fullStart += childWidth;
            }

            throw Errors.invalidOperation();
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            if (index === 0) {
                array.unshift.apply(array, this.nodeOrTokens);
            }
            else {
                // TODO: this seems awfully innefficient.  Can we do better here?
                array.splice.apply(array, [index, <any>0].concat(this.nodeOrTokens));
            }
        }
    }

    export function list(nodes: ISyntaxNodeOrToken[]): ISyntaxList {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return emptyList;
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            return new SingletonSyntaxList(item);
        }

        return new NormalSyntaxList(nodes);
    }
}