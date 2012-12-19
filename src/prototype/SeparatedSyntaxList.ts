///<reference path='IntegerUtilities.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='SyntaxFacts.ts' />

module Syntax {
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

        private collectTextElements(elements: string[]): void {
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

        public toArray(): ISyntaxElement[] {
            return [];
        }

        public toSyntaxNodeArray(): SyntaxNode[] {
            return [];
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

        public syntaxElementThatContainsPosition(position: number): SyntaxNode {
            // This should never have been called on this list.  It has a 0 width, so the client 
            // should have skipped over this.
            throw Errors.invalidOperation();
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

        private collectTextElements(elements: string[]): void {
            (<any>this.item).collectTextElements(elements);
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

        public toArray(): ISyntaxElement[] {
            return [this.item];
        }

        public toSyntaxNodeArray(): SyntaxNode[] {
            return [this.item];
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

        public syntaxElementThatContainsPosition(position: number): SyntaxNode {
            Debug.assert(position >= 0 && position < this.item.fullWidth());
            return this.item;
        }
    }

    class NormalSeparatedSyntaxList implements ISeparatedSyntaxList {
        private elements: ISyntaxElement[];
        private _data: number = -1;

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

        public lastToken(): ISyntaxToken {
            var token;
            for (var i = this.elements.length - 1; i >= 0; i--) {
                if (i % 2 === 0) {
                    var node = <SyntaxNode>this.elements[i];
                    token = node.lastToken();
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

        public fullText(): string {
            var elements: string[] = [];
            this.collectTextElements(elements);
            return elements.join("");
        }

        public toArray(): ISyntaxElement[] {
            return this.elements.slice(0);
        }

        public toSyntaxNodeArray(): SyntaxNode[] {
            var result: SyntaxNode[] = [];
            for (var i = 0, n = this.syntaxNodeCount(); i < n; i++) {
                result.push(this.syntaxNodeAt(i));
            }

            return result;
        }

        public isTypeScriptSpecific(): bool {
            for (var i = 0, n = this.syntaxNodeCount(); i < n; i++) {
                if (this.syntaxNodeAt(i).isTypeScriptSpecific()) {
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
            
            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];
                
                var childWidth = element.fullWidth();
                fullWidth += childWidth;

                if (i % 2 === 0) {
                    var node = <SyntaxNode>element;

                    hasSkippedText = hasSkippedText || node.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || node.hasZeroWidthToken();
                }
                else {
                    var token = <ISyntaxToken>element;

                    hasSkippedText = hasSkippedText || token.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
                }
            }

            return fullWidth | (hasSkippedText ? Constants.NodeSkippedTextMask : 0) | (hasZeroWidthToken ? Constants.NodeZeroWidthTokenMask : 0);
        }
    
        private data(): number {
            if (this._data === -1) {
                this._data = this.computeData();
            }

            return this._data;
        }

        public syntaxElementThatContainsPosition(position: number): ISyntaxElement {
            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];

                var childWidth = element.fullWidth();
                if (position < childWidth) { return element; }
                position -= childWidth;
            }

            throw Errors.invalidOperation();
        }

        private collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element: any = this.elements[i];
                element.collectTextElements(elements);
            }
        }
    }

    export function separatedList(nodes: ISyntaxElement[]): ISeparatedSyntaxList {
        return separatedListAndValidate(nodes, false);
    }

    export function separatedListAndValidate(nodes: ISyntaxElement[], validate: bool): ISeparatedSyntaxList {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return emptySeparatedList;
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

    export var emptySeparatedList: ISeparatedSyntaxList = new EmptySeparatedSyntaxList();
}