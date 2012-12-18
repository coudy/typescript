///<reference path='ISyntaxList.ts' />

module Syntax {
    function collectSyntaxListTextElements(elements: string[], list: ISyntaxList): void {
        for (var i = 0, n = list.count(); i < n; i++) {
            list.syntaxNodeAt(i).collectTextElements(elements);
        }
    }

    class EmptySyntaxList implements ISyntaxList {
        public isToken(): bool { return false; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return true; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind(): SyntaxKind { return SyntaxKind.List; }

        public toJSON(key) {
            return [];
        }

        public count(): number {
            return 0;
        }

        public isMissing(): bool {
            return true;
        }
        
        public syntaxNodeAt(index: number): SyntaxNode {
            throw Errors.argumentOutOfRange("index");
        }

        public collectTextElements(elements: string[]): void {
            return collectSyntaxListTextElements(elements, this);
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
    }

    export var emptyList: ISyntaxList = new EmptySyntaxList();

    class SingletonSyntaxList implements ISyntaxList {
        private _item: SyntaxNode;

        constructor(item: SyntaxNode) {
            this._item = item;
        }
        
        public isToken(): bool { return false; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return true; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind(): SyntaxKind { return SyntaxKind.List; }
        public isMissing(): bool { return this._item.isMissing(); }

        public toJSON(key) {
            return [this._item];
        }
        
        public count() {
            return 1;
        }
        
        public syntaxNodeAt(index: number) {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this._item;
        }

        public collectTextElements(elements: string[]): void {
            return collectSyntaxListTextElements(elements, this);
        }

        public toArray(): SyntaxNode[] {
            return [this._item];
        }

        public firstToken(): ISyntaxToken {
            return this._item.firstToken();
        }

        public lastToken(): ISyntaxToken {
            return this._item.lastToken();
        }

        public fullWidth(): number {
            return this._item.fullWidth();
        }

        public fullText(): string {
            return this._item.fullText();
        }

        public isTypeScriptSpecific(): bool {
            return this._item.isTypeScriptSpecific();
        }

        public hasSkippedText(): bool {
            return this._item.hasSkippedText();
        }

        public hasZeroWidthToken(): bool {
            return this._item.hasZeroWidthToken();
        }
    }

    class NormalSyntaxList implements ISyntaxList {
        private nodes: SyntaxNode[];
        private _data: number = -1;

        constructor(nodes: SyntaxNode[]) {
            this.nodes = nodes;
        }
        
        public isToken(): bool { return false; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return true; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind(): SyntaxKind { return SyntaxKind.List; }

        public isMissing(): bool {
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                if (!this.nodes[i].isMissing()) {
                    return false;
                }
            }

            return true;
        }

        public toJSON(key) {
            return this.nodes;
        }

        public count() {
            return this.nodes.length;
        }

        public syntaxNodeAt(index: number) {
            if (index < 0 || index >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodes[index];
        }

        public collectTextElements(elements: string[]): void {
            return collectSyntaxListTextElements(elements, this);
        }

        public toArray(): SyntaxNode[] {
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

        public fullWidth(): number {
            return this.data() & Constants.NodeFullWidthMask;
        }

        private computeData(): number {
            var fullWidth = 0;
            var hasSkippedText = false;
            var hasZeroWidthToken = false;

            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var node = this.nodes[i];
                fullWidth += node.fullWidth();
                hasSkippedText = hasSkippedText || node.hasSkippedText();
                hasZeroWidthToken = hasZeroWidthToken || node.hasZeroWidthToken();
            }

            return fullWidth | (hasSkippedText ? Constants.NodeSkippedTextMask : 0) | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0);
        }
    
        private data(): number {
            if (this._data === -1) {
                this._data = this.computeData();
            }

            return this._data;
        }
    }

    export function list(nodes: SyntaxNode[]): ISyntaxList {
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