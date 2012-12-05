///<reference path='References.ts' />

module SyntaxList {
    class EmptySyntaxList implements ISyntaxList {
        public syntaxKind(): SyntaxKind { return SyntaxKind.List; }

        public toJSON(key) {
            return [];
        }

        public count(): number {
            return 0;
        }
        
        public syntaxNodeAt(index: number): SyntaxNode {
            throw Errors.argumentOutOfRange("index");
        }
    }

    export var empty: ISyntaxList = new EmptySyntaxList();

    class SingletonSyntaxList implements ISyntaxList {
        private _item: SyntaxNode;

        constructor(item: SyntaxNode) {
            this._item = item;
        }

        public syntaxKind(): SyntaxKind { return SyntaxKind.List; }

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
    }

    class NormalSyntaxList implements ISyntaxList {
        private nodes: SyntaxNode[];

        constructor(nodes: SyntaxNode[]) {
            this.nodes = nodes;
        }

        public syntaxKind(): SyntaxKind { return SyntaxKind.List; }

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
    }

    export function create(nodes: SyntaxNode[]): ISyntaxList {
        if (nodes === null || nodes.length === 0) {
            return empty;
        }

        if (nodes.length === 1) {
            var item = nodes[0];
            return new SingletonSyntaxList(item);
        }

        return new NormalSyntaxList(nodes);
    }
}