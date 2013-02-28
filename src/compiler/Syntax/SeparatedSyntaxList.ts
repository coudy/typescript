///<reference path='..\Core\IntegerUtilities.ts' />
///<reference path='ISeparatedSyntaxList.ts' />
///<reference path='PositionedElement.ts' />
///<reference path='SyntaxFacts.ts' />
///<reference path='SyntaxFacts.ts' />

module Syntax {
    export var emptySeparatedList: ISeparatedSyntaxList = {
        kind: () => SyntaxKind.SeparatedList,

        isNode: () => false,
        isToken: () => false,
        isList: () => false,
        isSeparatedList: () => true,

        toJSON: (key) => [],

        childCount: () => 0,
        nonSeparatorCount: () => 0,
        separatorCount: () => 0,

        toArray: () => [],
        toNonSeparatorArray: () => [],

        childAt: (index: number): ISyntaxNodeOrToken => {
            throw Errors.argumentOutOfRange("index");
        },

        nonSeparatorAt: (index: number): ISyntaxNodeOrToken => {
            throw Errors.argumentOutOfRange("index");
        },

        separatorAt: (index: number): ISyntaxToken => {
            throw Errors.argumentOutOfRange("index");
        },

        collectTextElements: (elements: string[]): void => { },

        firstToken: (): ISyntaxToken => null,
        lastToken: (): ISyntaxToken => null,

        fullWidth: () => 0,
        fullText: () => "",

        width: () => 0,

        isTypeScriptSpecific: () => false,
        hasSkippedText: () => false,
        hasZeroWidthToken: () => false,
        hasRegularExpressionToken: () => false,

        findTokenInternal: (parent: PositionedElement, position: number, fullStart: number): PositionedToken => {
            // This should never have been called on this list.  It has a 0 width, so the client 
            // should have skipped over this.
            throw Errors.invalidOperation();
        },

        insertChildrenInto: (array: ISyntaxElement[], index: number): void => {
        },

        leadingTrivia: () => Syntax.emptyTriviaList,
        trailingTrivia: () => Syntax.emptyTriviaList,

        leadingTriviaWidth: () => 0,
        trailingTriviaWidth:() => 0
    }

    class SingletonSeparatedSyntaxList implements ISeparatedSyntaxList {
        private item: ISyntaxNodeOrToken;

        constructor(item: ISyntaxNodeOrToken) {
            this.item = item;
        }

        public toJSON(key) {
            return [this.item];
        }

        public kind() { return SyntaxKind.SeparatedList; }

        public isNode(): bool { return false; }
        public isToken(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return true; }

        public childCount() { return 1; }
        public nonSeparatorCount() { return 1; }
        public separatorCount() { return 0; }

        public toArray() { return [this.item]; }
        public toNonSeparatorArray() { return [this.item]; }

        public childAt(index: number): ISyntaxNodeOrToken {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        public nonSeparatorAt(index: number): ISyntaxNodeOrToken {
            if (index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.item;
        }

        public separatorAt(index: number): ISyntaxToken {
            throw Errors.argumentOutOfRange("index");
        }

        private collectTextElements(elements: string[]): void {
            this.item.collectTextElements(elements);
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

        public leadingTrivia(): ISyntaxTriviaList {
            return this.item.leadingTrivia();
        }

        public trailingTrivia(): ISyntaxTriviaList {
            return this.item.trailingTrivia();
        }

        public leadingTriviaWidth(): number {
            return this.item.leadingTriviaWidth();
        }

        public trailingTriviaWidth(): number {
            return this.item.trailingTriviaWidth();
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
                new PositionedSeparatedList(parent, this, fullStart), position, fullStart);
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            array.splice(index, 0, this.item);
        }
    }

    class NormalSeparatedSyntaxList implements ISeparatedSyntaxList {
        private elements: ISyntaxNodeOrToken[];
        private _data: number = -1;

        constructor(elements: ISyntaxNodeOrToken[]) {
            this.elements = elements;
        }

        public kind() { return SyntaxKind.SeparatedList; }

        public isToken(): bool { return false; }
        public isNode(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return true; }
        public toJSON(key) { return this.elements; }

        public childCount() { return this.elements.length; }
        public nonSeparatorCount() { return IntegerUtilities.integerDivide(this.elements.length + 1, 2); }
        public separatorCount() { return IntegerUtilities.integerDivide(this.elements.length, 2); }

        public toArray(): ISyntaxNodeOrToken[] { return this.elements.slice(0); }

        public toNonSeparatorArray(): ISyntaxNodeOrToken[] {
            var result: ISyntaxNodeOrToken[] = [];
            for (var i = 0, n = this.nonSeparatorCount(); i < n; i++) {
                result.push(this.nonSeparatorAt(i));
            }

            return result;
        }
        
        public childAt(index: number): ISyntaxNodeOrToken {
            if (index < 0 || index >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.elements[index];
        }

        public nonSeparatorAt(index: number): ISyntaxNodeOrToken {
            var value = index * 2;
            if (value < 0 || value >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }

            return this.elements[value];
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
                    var nodeOrToken = this.elements[i];
                    token = nodeOrToken.firstToken();
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
                    var nodeOrToken = this.elements[i];
                    token = nodeOrToken.lastToken();
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

        public isTypeScriptSpecific(): bool {
            for (var i = 0, n = this.nonSeparatorCount(); i < n; i++) {
                if (this.nonSeparatorAt(i).isTypeScriptSpecific()) {
                    return true;
                }
            }

            return false;
        }

        public hasSkippedText(): bool {
            return (this.data() & SyntaxConstants.NodeSkippedTextMask) !== 0;
        }

        public hasZeroWidthToken(): bool {
            return (this.data() & SyntaxConstants.NodeZeroWidthTokenMask) !== 0;
        }

        public hasRegularExpressionToken(): bool {
            return (this.data() & SyntaxConstants.NodeRegularExpressionTokenMask) !== 0;
        }

        public fullWidth(): number {
            return this.data() >>> SyntaxConstants.NodeFullWidthShift;
        }

        public width(): number {
            var fullWidth = this.fullWidth();
            return fullWidth - this.leadingTriviaWidth() - this.trailingTriviaWidth();
        }

        public leadingTrivia(): ISyntaxTriviaList {
            return this.firstToken().leadingTrivia();
        }

        public trailingTrivia(): ISyntaxTriviaList {
            return this.lastToken().trailingTrivia();
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

            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];

                var childWidth = element.fullWidth();
                fullWidth += childWidth;

                if (i % 2 === 0) {
                    var nodeOrToken = element;

                    hasSkippedText = hasSkippedText || nodeOrToken.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || nodeOrToken.hasZeroWidthToken();
                    hasRegularExpressionToken = hasRegularExpressionToken || nodeOrToken.hasRegularExpressionToken();
                }
                else {
                    var token = <ISyntaxToken>element;

                    hasSkippedText = hasSkippedText || token.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);

                    // A regex token never shows up as a separator token in a list.  If the language
                    // ever changes, add hte appropriate check here.
                }
            }

            return (fullWidth << SyntaxConstants.NodeFullWidthShift)
                 | (hasSkippedText ? SyntaxConstants.NodeSkippedTextMask : 0)
                 | (hasZeroWidthToken ? SyntaxConstants.NodeZeroWidthTokenMask : 0)
                 | (hasRegularExpressionToken ? SyntaxConstants.NodeRegularExpressionTokenMask : 0);
        }

        private data(): number {
            if (this._data === -1) {
                this._data = this.computeData();
            }

            return this._data;
        }

        public findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            parent = new PositionedSeparatedList(parent, this, fullStart);
            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];

                var childWidth = element.fullWidth();
                if (position < childWidth) {
                    return (<any>element).findTokenInternal(parent, position, fullStart);
                }

                position -= childWidth;
                fullStart += childWidth;
            }

            throw Errors.invalidOperation();
        }

        private collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];
                element.collectTextElements(elements);
            }
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number): void {
            if (index === 0) {
                array.unshift.apply(array, this.elements);
            }
            else {
                // TODO: this seems awfully innefficient.  Can we do better here?
                array.splice.apply(array, [index, <any>0].concat(this.elements));
            }
        }
    }

    export function separatedList(nodes: ISyntaxNodeOrToken[]): ISeparatedSyntaxList {
        return separatedListAndValidate(nodes, false);
    }

    function separatedListAndValidate(nodes: ISyntaxNodeOrToken[], validate: bool): ISeparatedSyntaxList {
        if (nodes === undefined || nodes === null || nodes.length === 0) {
            return emptySeparatedList;
        }

        if (validate) {
            for (var i = 0; i < nodes.length; i++) {
                var item = nodes[i];

                if (i % 2 === 1) {
                    // Debug.assert(SyntaxFacts.isTokenKind(item.kind()));
                }
            }
        }

        if (nodes.length === 1) {
            return new SingletonSeparatedSyntaxList(nodes[0]);
        }

        return new NormalSeparatedSyntaxList(nodes);
    }
}