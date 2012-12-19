///<reference path='ISyntaxList.ts' />

module Syntax {
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

        public findTokenInternal(position: number): SyntaxNode {
            // This should never have been called on this list.  It has a 0 width, so the client 
            // should have skipped over this.
            throw Errors.invalidOperation();
        }
    }

    export var emptyList: ISyntaxList = new EmptySyntaxList();

    class SingletonSyntaxList implements ISyntaxList {
        private item: SyntaxNode;

        constructor(item: SyntaxNode) {
            this.item = item;
        }
        
        public isToken(): bool { return false; }
        public isNode(): bool{ return false; }
        public isList(): bool{ return true; }
        public isSeparatedList(): bool{ return false; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind(): SyntaxKind { return SyntaxKind.List; }
        public isMissing(): bool { return this.item.isMissing(); }

        public toJSON(key) {
            return [this.item];
        }
        
        public count() {
            return 1;
        }
        
        public syntaxNodeAt(index: number) {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        private collectTextElements(elements: string[]): void {
            (<any>this.item).collectTextElements(elements, this);
        }

        public toArray(): SyntaxNode[] {
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

        public findTokenInternal(position: number): SyntaxNode {
            Debug.assert(position >= 0 && position < this.item.fullWidth());
            return (<any>this.item).findTokenInternal(position);
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

        private collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var element: any = this.nodes[i];
                element.collectTextElements(elements);
            }
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

        public hasRegularExpressionToken(): bool {
            return (this.data() & Constants.NodeRegularExpressionTokenMask) !== 0;
        }

        public fullWidth(): number {
            return this.data() & Constants.NodeFullWidthMask;
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

            return fullWidth
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

        public findTokenInternal(position: number): SyntaxNode {
            Debug.assert(position >= 0 && position < this.fullWidth());

            for (var i = 0, n = this.nodes.length; i < n; i++) {
                var node = this.nodes[i];

                var childWidth = node.fullWidth();
                if (position < childWidth) { return (<any>node).findTokenInternal(position); }
                position -= childWidth;
            }

            throw Errors.invalidOperation();
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