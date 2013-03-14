///<reference path='SyntaxRewriter.generated.ts' />
///<reference path='..\Core\Errors.ts' />
///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxToken.ts' />
///<reference path='SyntaxVisitor.generated.ts' />
///<reference path='SyntaxTokenReplacer.ts' />

module TypeScript {
    export class SyntaxNode implements ISyntaxNodeOrToken {
        private _data: number;

        constructor(parsedInStrictMode: bool) {
            this._data = parsedInStrictMode ? SyntaxConstants.NodeParsedInStrictModeMask : 0;
        }

        public isNode(): bool { return true; }
        public isToken(): bool { return false; }
        public isList(): bool { return false; }
        public isSeparatedList(): bool { return false; }

        public kind(): SyntaxKind {
            throw Errors.abstract();
        }

        public childCount(): number {
            throw Errors.abstract();
        }

        public childAt(slot: number): ISyntaxElement {
            throw Errors.abstract();
        }

        // Returns the first non-missing token inside this node (or null if there are no such token).
        public firstToken(): ISyntaxToken {
            for (var i = 0, n = this.childCount(); i < n; i++) {
                var element = this.childAt(i);

                if (element != null) {
                    if (element.fullWidth() > 0 || element.kind() === SyntaxKind.EndOfFileToken) {
                        return element.firstToken();
                    }
                }
            }

            return null;
        }

        // Returns the last non-missing token inside this node (or null if there are no such token).
        public lastToken(): ISyntaxToken {
            for (var i = this.childCount() - 1; i >= 0; i--) {
                var element = this.childAt(i);

                if (element != null) {
                    if (element.fullWidth() > 0 || element.kind() === SyntaxKind.EndOfFileToken) {
                        return element.lastToken();
                    }
                }
            }

            return null;
        }

        public insertChildrenInto(array: ISyntaxElement[], index: number) {
            for (var i = this.childCount() - 1; i >= 0; i--) {
                var element = this.childAt(i);

                if (element !== null) {
                    if (element.isNode() || element.isToken()) {
                        array.splice(index, 0, element);
                    }
                    else if (element.isList()) {
                        (<ISyntaxList>element).insertChildrenInto(array, index);
                    }
                    else if (element.isSeparatedList()) {
                        (<ISeparatedSyntaxList>element).insertChildrenInto(array, index);
                    }
                    else {
                        throw Errors.invalidOperation();
                    }
                }
            }
        }

        public leadingTrivia(): ISyntaxTriviaList {
            return this.firstToken().leadingTrivia();
        }

        public trailingTrivia(): ISyntaxTriviaList {
            return this.lastToken().trailingTrivia();
        }

        public toJSON(key) {
            var result: any = {
                kind: (<any>SyntaxKind)._map[this.kind()],
                fullWidth: this.fullWidth()
            };

            if (this.hasSkippedText()) {
                result.hasSkippedText = true;
            }

            if (this.hasZeroWidthToken()) {
                result.hasZeroWidthToken = true;
            }

            if (this.hasRegularExpressionToken()) {
                result.hasRegularExpressionToken = true;
            }

            if (this.parsedInStrictMode()) {
                result.parsedInStrictMode = true;
            }

            for (var i = 0, n = this.childCount(); i < n; i++) {
                var value = this.childAt(i);

                if (value) {
                    for (var name in this) {
                        if (value === this[name]) {
                            result[name] = value;
                            break;
                        }
                    }
                }
            }

            return result;
        }

        public accept(visitor: ISyntaxVisitor): any {
            throw Errors.abstract();
        }

        public fullText(): string {
            var elements: string[] = [];
            this.collectTextElements(elements);
            return elements.join("");
        }

        public collectTextElements(elements: string[]): void {
            for (var i = 0, n = this.childCount(); i < n; i++) {
                var element = this.childAt(i);

                if (element !== null) {
                    element.collectTextElements(elements)
                }
            }
        }

        public replaceToken(token1: ISyntaxToken, token2: ISyntaxToken): SyntaxNode {
            if (token1 === token2) {
                return this;
            }

            return this.accept(new SyntaxTokenReplacer(token1, token2));
        }

        public withLeadingTrivia(trivia: ISyntaxTriviaList): SyntaxNode {
            return this.replaceToken(this.firstToken(), this.firstToken().withLeadingTrivia(trivia));
        }

        public withTrailingTrivia(trivia: ISyntaxTriviaList): SyntaxNode {
            return this.replaceToken(this.lastToken(), this.lastToken().withTrailingTrivia(trivia));
        }

        public hasLeadingTrivia(): bool {
            return this.lastToken().hasLeadingTrivia();
        }

        public hasTrailingTrivia(): bool {
            return this.lastToken().hasTrailingTrivia();
        }

        public isTypeScriptSpecific(): bool {
            return false;
        }

        public hasSkippedText(): bool {
            return (this.data() & SyntaxConstants.NodeSkippedTextMask) !== 0;
        }

        public hasZeroWidthToken(): bool {
            return (this.data() & SyntaxConstants.NodeZeroWidthTokenMask) !== 0;
        }

        // True if this node contains a regex token somewhere under it.  A regex token is either a 
        // regex itself (i.e. /foo/), or is a token which could start a regex (i.e. "/" or "/=").  This
        // data is used by the incremental parser to decide if a node can be reused.  Due to the 
        // lookahead nature of regex tokens, a node containing a regex token cannot be reused.  Normally,
        // changes to text only affect the tokens directly intersected.  However, because regex tokens 
        // have such unbounded lookahead (technically bounded at the end of a line, but htat's minor), 
        // we need to recheck them to see if they've changed due to the edit.  For example, if you had:
        //
        //      while (true) /3; return;
        //
        // And you changed it to:
        //
        //      while (true) /3; return/;
        //
        // Then even though only the 'return' and ';' colons were touched, we'd want to rescan the '/'
        // token which we would then realize was a regex.
        public hasRegularExpressionToken(): bool {
            return (this.data() & SyntaxConstants.NodeRegularExpressionTokenMask) !== 0;
        }

        // True if this node was parsed while the parser was in 'strict' mode.  A node parsed in strict
        // mode cannot be reused if the parser is non-strict mode (and vice versa).  This is because 
        // the parser parses things differently in strict mode and thus the tokens may be interpretted
        // differently if the mode is changed. 
        public parsedInStrictMode(): bool {
            return (this.data() & SyntaxConstants.NodeParsedInStrictModeMask) !== 0;
        }

        public fullWidth(): number {
            return this.data() >>> SyntaxConstants.NodeFullWidthShift;
        }

        private computeData(): number {
            var slotCount = this.childCount();

            var fullWidth = 0;
            var childWidth = 0;
            var hasSkippedText = false;

            // If we have no children (like an OmmittedExpressionSyntax), we automatically have a zero 
            // width token.
            var hasZeroWidthToken = slotCount === 0;
            var hasRegularExpressionToken = false;

            for (var i = 0, n = slotCount; i < n; i++) {
                var element = this.childAt(i);

                if (element !== null) {
                    childWidth = element.fullWidth();
                    fullWidth += childWidth;

                    if (!hasSkippedText) {
                        hasSkippedText = element.hasSkippedText();
                    }

                    if (!hasZeroWidthToken) {
                        hasZeroWidthToken = element.hasZeroWidthToken();
                    }

                    if (!hasRegularExpressionToken) {
                        hasRegularExpressionToken = element.hasRegularExpressionToken();
                    }
                }
            }

            return (fullWidth << SyntaxConstants.NodeFullWidthShift)
                 | (hasSkippedText ? SyntaxConstants.NodeSkippedTextMask : 0)
                 | (hasZeroWidthToken ? SyntaxConstants.NodeZeroWidthTokenMask : 0)
                 | (hasRegularExpressionToken ? SyntaxConstants.NodeRegularExpressionTokenMask : 0);
        }

        private data(): number {
            if (this._data === 0 || this._data === SyntaxConstants.NodeParsedInStrictModeMask) {
                this._data |= this.computeData();
            }

            return this._data;
        }

        /// <summary>
        /// Finds a token according to the following rules:
        /// 1) If position matches the End of the node/s FullSpan and the node is SourceUnit,
        ///    then the EOF token is returned. 
        /// 
        ///  2) If node.FullSpan.Contains(position) then the token that contains given position is
        ///     returned.
        /// 
        ///  3) Otherwise an ArgumentOutOfRangeException is thrown
        ///
        /// Note: findToken will always return a non missing token with width greater than or equal to
        /// 1 (except for EOF).  Empty tokens syntehsized by teh parser are never returned.
        /// </summary>
        public findToken(position: number): PositionedToken {
            var endOfFileToken = this.tryGetEndOfFileAt(position);
            if (endOfFileToken !== null) {
                return endOfFileToken;
            }

            if (position < 0 || position >= this.fullWidth()) {
                throw Errors.argumentOutOfRange("position");
            }

            return this.findTokenInternal(null, position, 0);
        }

        private tryGetEndOfFileAt(position: number): PositionedToken {
            if (this.kind() === SyntaxKind.SourceUnit && position === this.fullWidth()) {
                var sourceUnit = <SourceUnitSyntax>this;
                return new PositionedToken(
                    new PositionedNode(null, sourceUnit, 0),
                    sourceUnit.endOfFileToken, sourceUnit.moduleElements.fullWidth());
            }

            return null;
        }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            // Debug.assert(position >= 0 && position < this.fullWidth());

            parent = new PositionedNode(parent, this, fullStart);
            for (var i = 0, n = this.childCount(); i < n; i++) {
                var element = this.childAt(i);

                if (element !== null) {
                    var childWidth = element.fullWidth();

                    if (position < childWidth) {
                        return (<any>element).findTokenInternal(parent, position, fullStart);
                    }

                    position -= childWidth;
                    fullStart += childWidth;
                }
            }

            throw Errors.invalidOperation();
        }

        public findTokenOnLeft(position: number): PositionedToken {
            var positionedToken = this.findToken(position);
            var start = positionedToken.start();

            // Position better fall within this token.
            // Debug.assert(position >= positionedToken.fullStart());
            // Debug.assert(position < positionedToken.fullEnd() || positionedToken.token().tokenKind === SyntaxKind.EndOfFileToken);

            // if position is after the start of the token, then this token is the token on the left.
            if (position > start) {
                return positionedToken;
            }

            // we're in the trivia before the start of the token.  Need to return the previous token.
            if (positionedToken.fullStart() === 0) {
                // Already on the first token.  Nothing before us.
                return null;
            }

            var previousToken = this.findToken(positionedToken.fullStart() - 1);

            // Position better be after this token.
            // Debug.assert(previousToken.fullEnd() <= position);

            return previousToken;
        }

        public isModuleElement(): bool {
            return false;
        }

        public isClassElement(): bool {
            return false;
        }

        public isTypeMember(): bool {
            return false
        }

        public isStatement(): bool {
            return false;
        }

        public isSwitchClause(): bool {
            return false;
        }

        public structuralEquals(node: SyntaxNode): bool {
            if (this === node) { return true; }
            if (node === null) { return false; }
            if (this.kind() !== node.kind()) { return false; }

            for (var i = 0, n = this.childCount(); i < n; i++) {
                var element1 = this.childAt(i);
                var element2 = node.childAt(i);

                if (!Syntax.elementStructuralEquals(element1, element2)) {
                    return false;
                }
            }

            return true;
        }

        public width(): number {
            return this.fullWidth() - this.leadingTriviaWidth() - this.trailingTriviaWidth();
        }

        public leadingTriviaWidth() {
            var firstToken = this.firstToken();
            return firstToken === null ? 0 : firstToken.leadingTriviaWidth();
        }

        public trailingTriviaWidth() {
            var lastToken = this.lastToken();
            return lastToken === null ? 0 : lastToken.trailingTriviaWidth();
        }
    }
}