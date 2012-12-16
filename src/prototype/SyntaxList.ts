///<reference path='ISyntaxList.ts' />

module SyntaxList {
    function collectTextElements(elements: string[], list: ISyntaxList): void {
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
            return collectTextElements(elements, this);
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
    }

    export var empty: ISyntaxList = new EmptySyntaxList();

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
            return collectTextElements(elements, this);
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
    }

    class NormalSyntaxList implements ISyntaxList {
        private nodes: SyntaxNode[];

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
            return collectTextElements(elements, this);
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

        public fullWidth(): number {
            var width = 0
            for (var i = 0, n = this.nodes.length; i < n; i++) {
                width += this.nodes[i].fullWidth();
            }

            return width;
        }
    }

    export function create(nodes: SyntaxNode[]): ISyntaxList {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return empty;
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            return new SingletonSyntaxList(item);
        }

        return new NormalSyntaxList(nodes);
    }
}