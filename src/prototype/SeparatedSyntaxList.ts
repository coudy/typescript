///<reference path='References.ts' />

module SeparatedSyntaxList {
    class EmptySeparatedSyntaxList implements ISeparatedSyntaxList {
        public syntaxKind() { return SyntaxKind.SeparatedList; }

        public toJSON(key) { return []; }

        public count() { return 0; }
        public syntaxNodeCount() { return 0; }
        public separatorCount() { return 0 }

        public itemAt(index: number): any {
            throw Errors.argumentOutOfRange("index");
        }

        public syntaxNodeAt(index: number): SyntaxNode {
            throw Errors.argumentOutOfRange("index");
        }

        public separatorAt(index: number): ISyntaxToken {
            throw Errors.argumentOutOfRange("index");
        }
    }

    class SingletonSeparatedSyntaxList implements ISeparatedSyntaxList {
        private item: any;

        constructor(item: any) {
            this.item = item;
        }

        public toJSON(key) {
            return [this.item];
        }

        public syntaxKind() { return SyntaxKind.SeparatedList; }
        public count() { return 1; }
        public syntaxNodeCount() { return 1; }
        public separatorCount() { return 0; }

        public itemAt(index: number): any {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        public syntaxNodeAt(index: number) {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        public separatorAt(index: number): ISyntaxToken {
            throw Errors.argumentOutOfRange("index");
        }
    }

    class NormalSeparatedSyntaxList implements ISeparatedSyntaxList {
        private nodes: any[];

        constructor(nodes: any[]) {
            this.nodes = nodes;
        }
        
        public syntaxKind() { return SyntaxKind.SeparatedList; }
        public toJSON(key) { return this.nodes; }

        public count() { return this.nodes.length; }
        public syntaxNodeCount() { return IntegerUtilities.integerDivide(this.nodes.length + 1, 2); }
        public separatorCount() { return IntegerUtilities.integerDivide(this.nodes.length, 2); }

        public itemAt(index: number): any {
            if (index < 0 || index >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodes[index];
        }

        public syntaxNodeAt(index: number): SyntaxNode {
            var value = index * 2;
            if (value < 0 || value >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodes[value];
        }

        public separatorAt(index: number): ISyntaxToken {
            var value = index * 2 + 1;
            if (value < 0 || value >= this.nodes.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.nodes[value];
        }
    }
    
    export var empty: ISeparatedSyntaxList = new EmptySeparatedSyntaxList();
    export function create(nodes: any[]): ISeparatedSyntaxList {
        if (nodes === null || nodes.length === 0) {
            return empty;
        }

        //for (var i = 0; i < nodes.length; i++) {
        //    var item = nodes[i];

        //    if (i % 2 === 0) {
        //        Debug.assert(!SyntaxFacts.isTokenKind(item.kind()));
        //    }
        //    else {
        //        Debug.assert(SyntaxFacts.isTokenKind(item.kind));
        //    }
        //}

        if (nodes.length === 1) {
            return new SingletonSeparatedSyntaxList(nodes[0]);
        }

        return new NormalSeparatedSyntaxList(nodes);
    }
}