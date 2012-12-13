///<reference path='References.ts' />

module SeparatedSyntaxList {
    function collectTextElements(elements: string[], list: ISeparatedSyntaxList): void {
        for (var i = 0, n = list.count(); i < n; i++) {
            list.itemAt(i).collectTextElements(elements);
        }
    }

    class EmptySeparatedSyntaxList implements ISeparatedSyntaxList {
        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return true; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind() { return SyntaxKind.SeparatedList; }
        public isMissing(): bool { return true; }

        public toJSON(key) { return []; }

        public count() { return 0; }
        public syntaxNodeCount() { return 0; }
        public separatorCount() { return 0 }

        public itemAt(index: number): ISyntaxElement {
            throw Errors.argumentOutOfRange("index");
        }

        public syntaxNodeAt(index: number): SyntaxNode {
            throw Errors.argumentOutOfRange("index");
        }

        public separatorAt(index: number): ISyntaxToken {
            throw Errors.argumentOutOfRange("index");
        }

        public collectTextElements(elements: string[]): void {
            return collectTextElements(elements, this);
        }

        public firstToken(): ISyntaxToken {
            return null;
        }
    }

    class SingletonSeparatedSyntaxList implements ISeparatedSyntaxList {
        private item: SyntaxNode;
        
        constructor(item: SyntaxNode) {
            this.item = item;
        }

        public toJSON(key) {
            return [this.item];
        }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return true; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind() { return SyntaxKind.SeparatedList; }
        public isMissing(): bool { return this.item.isMissing(); }

        public count() { return 1; }
        public syntaxNodeCount() { return 1; }
        public separatorCount() { return 0; }

        public itemAt(index: number): ISyntaxElement {
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

        public collectTextElements(elements: string[]): void {
            return collectTextElements(elements, this);
        }

        public firstToken(): ISyntaxToken {
            return this.item.firstToken();
        }
    }

    class NormalSeparatedSyntaxList implements ISeparatedSyntaxList {
        private elements: ISyntaxElement[];

        constructor(elements: ISyntaxElement[]) {
            this.elements = elements;
        }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return true; }
        public isTrivia(): bool { return false; }
        public isTriviaList(): bool { return false; }
        public kind() { return SyntaxKind.SeparatedList; }
        public toJSON(key) { return this.elements; }

        public isMissing(): bool {
            for (var i = 0, n = this.elements.length; i < n; i++) {
                if (!this.elements[i].isMissing()) {
                    return false;
                }
            }

            return true;
        }

        public count() { return this.elements.length; }
        public syntaxNodeCount() { return IntegerUtilities.integerDivide(this.elements.length + 1, 2); }
        public separatorCount() { return IntegerUtilities.integerDivide(this.elements.length, 2); }

        public itemAt(index: number): ISyntaxElement {
            if (index < 0 || index >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.elements[index];
        }

        public syntaxNodeAt(index: number): SyntaxNode {
            var value = index * 2;
            if (value < 0 || value >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return <SyntaxNode>this.elements[value];
        }

        public separatorAt(index: number): ISyntaxToken {
            var value = index * 2 + 1;
            if (value < 0 || value >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return <ISyntaxToken>this.elements[value];
        }

        public collectTextElements(elements: string[]): void {
            return collectTextElements(elements, this);
        }

        public firstToken(): ISyntaxToken {
            var token;
            for (var i = 0, n = this.elements.length; i < n; i++) {
                if (i % 2 === 0) {
                    var node = <SyntaxNode>this.elements[i];
                    token = node.firstToken();
                    if (token !== null) {
                        return token;
                    }
                }
                else {
                    token = <ISyntaxToken>this.elements[i];
                    if (token.width() > 0) {
                        return token;
                    }
                }
            }

            return null;
        }
    }

    export var empty: ISeparatedSyntaxList = new EmptySeparatedSyntaxList();

    export function create(nodes: ISyntaxElement[]): ISeparatedSyntaxList {
        return createAndValidate(nodes, false);
    }

    export function createAndValidate(nodes: ISyntaxElement[], validate: bool): ISeparatedSyntaxList {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return empty;
        }

        if (validate) {
            for (var i = 0; i < nodes.length; i++) {
                var item = nodes[i];

                if (i % 2 === 0) {
                    Debug.assert(!SyntaxFacts.isTokenKind(item.kind()));
                }
                else {
                    Debug.assert(SyntaxFacts.isTokenKind(item.kind()));
                }
            }
        }

        if (nodes.length === 1) {
            Debug.assert(nodes[0].isNode());
            return new SingletonSeparatedSyntaxList(<SyntaxNode>nodes[0]);
        }

        return new NormalSeparatedSyntaxList(nodes);
    }
}