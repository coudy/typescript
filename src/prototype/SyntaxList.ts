///<reference path='ISyntaxList.ts' />

module Syntax {
    class EmptySyntaxList implements ISyntaxList {
        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isNode(): bool { return false; }
        public isToken(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isList(): bool { return true; }
        public isSeparatedList(): bool { return false; }
        public isTriviaList(): bool { return false; }

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

        public findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
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
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }

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
            (<any>this.item).collectTextElements(elements, this);
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

        public findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
            Debug.assert(position >= 0 && position < this.item.fullWidth());
            return (<any>this.item).findTokenInternal(position, fullStart);
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            array.splice(index, 0, this.item);
        }
    }

    class NormalSyntaxList implements ISyntaxList {
        private nodes: ISyntaxNodeOrToken[];
        private _data: number = -1;

        constructor(nodes: ISyntaxNodeOrToken[]) {
            this.nodes = nodes;
        }

        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isNode(): bool { return false; }
        public isToken(): bool { return false; }
        public isTrivia(): bool { return false; }
        public isList(): bool { return true; }
        public isSeparatedList(): bool { return false; }
        public isTriviaList(): bool { return false; }

        public toJSON(key) {
            return this.nodes;
        }

        public count() {
            return this.nodes.length;
        }

        public itemAt(index: number): ISyntaxNodeOrToken {
            if (index < 0 || index >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodes[index];
        }

        private collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var element: any = this.nodes[i];
                element.collectTextElements(elements);
            }
        }

        public toArray(): ISyntaxNodeOrToken[] {
            return this.nodes.slice(0);
        }

        public firstToken(): ISyntaxToken {
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var token = this.nodes[i].firstToken();
                if (token !== null) {
                    return token;
                }
            }

            return null;
        }

        public lastToken(): ISyntaxToken {
            for (var i = this.nodes.length - 1; i >= 0; i--) {
                var token = this.nodes[i].lastToken();
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
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                if (this.nodes[i].isTypeScriptSpecific()) {
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
            return fullWidth - this.firstToken().leadingTriviaWidth() - this.lastToken().trailingTriviaWidth();
        }

        private computeData(): number {
            var fullWidth = 0;
            var hasSkippedText = false;
            var hasZeroWidthToken = false;
            var hasRegularExpressionToken = false;

            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var node = this.nodes[i];
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

        public findTokenInternal(position: number, fullStart: number): { token: ISyntaxToken; fullStart: number; } {
            Debug.assert(position >= 0 && position < this.fullWidth());

            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var node = this.nodes[i];

                var childWidth = node.fullWidth();
                if (position < childWidth) { return (<any>node).findTokenInternal(position, fullStart); }

                position -= childWidth;
                fullStart += childWidth;
            }

            throw Errors.invalidOperation();
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            if (index === 0) {
                array.unshift.apply(array, this.nodes);
            }
            else {
                // TODO: this seems awfully innefficient.  Can we do better here?
                array.splice.apply(array, [index, <any>0].concat(this.nodes));
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