///<reference path='Errors.ts' />
///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxToken.ts' />
///<reference path='ISyntaxVisitor.ts' />
///<reference path='SyntaxRealizer.ts' />
///<reference path='SyntaxTokenReplacer.ts' />

class SyntaxNode implements ISyntaxElement {
    private _data: number = -1;

    public isToken(): bool { return false; }
    public isNode(): bool{ return true; }
    public isList(): bool{ return false; }
    public isSeparatedList(): bool{ return false; }
    public isTrivia(): bool { return false; }
    public isTriviaList(): bool { return false; }

    public kind(): SyntaxKind {
        throw Errors.abstract();
    }

    public isMissing(): bool {
        throw Errors.abstract();
    }

    // Returns the first non-missing token inside this node (or null if there are no such token).
    public firstToken(): ISyntaxToken {
        throw Errors.abstract();
    }

    // Returns the last non-missing token inside this node (or null if there are no such token).
    public lastToken(): ISyntaxToken {
        throw Errors.abstract();
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

        for (var name in this) {
            if (name !== "_data") {
                var value = this[name];
                if (value && typeof value === 'object') {
                    result[name] = value;
                }
            }
        }

        return result;
    }

    public accept(visitor: ISyntaxVisitor): any {
        throw Errors.abstract();
    }

    public realize(): SyntaxNode {
        return this.accept(new SyntaxRealizer());
    }

    public collectTextElements(elements: string[]): void {
        throw Errors.abstract();
    }

    public fullText(): string {
        var elements: string[] = [];
        this.collectTextElements(elements);
        return elements.join("");
    }

    public replaceToken(token1: ISyntaxToken, token2: ISyntaxToken): SyntaxNode {
        return this.accept(new SyntaxTokenReplacer(token1, token2));
    }

    public withLeadingTrivia(trivia: ISyntaxTriviaList): SyntaxNode {
        return this.replaceToken(this.firstToken(), this.firstToken().withLeadingTrivia(trivia));
    }

    public withTrailingTrivia(trivia: ISyntaxTriviaList): SyntaxNode {
        return this.replaceToken(this.lastToken(), this.lastToken().withTrailingTrivia(trivia));
    }

    public hasTrailingTrivia(): bool {
        return this.lastToken().hasTrailingTrivia();
    }

    public isTypeScriptSpecific(): bool {
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
        throw Errors.abstract();
    }
    
    private data(): number {
        if (this._data === -1) {
            this._data = this.computeData();
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
    public findToken(position: number): ISyntaxToken {
        var endOfFileToken = this.tryGetEndOfFileAt(position);
        if (endOfFileToken !== null) {
            return endOfFileToken;
        }

        if (position < 0 || position >= this.fullWidth()) {
            throw Errors.argumentOutOfRange("position");
        }

        return this.findTokenInternal(position);
    }

    private tryGetEndOfFileAt(position: number): ISyntaxToken {
        if (this.kind() === SyntaxKind.SourceUnit && position == this.fullWidth()) {
            var sourceUnit = <SourceUnitSyntax>this;
            return sourceUnit.endOfFileToken();
        }

        return null;
    }

    private findTokenInternal(position: number): ISyntaxToken {
        // While maintaining invariant   0 <= position < curNode.fullWidth()
        // go down the tree until a token is found
        var currentNodeOrToken: ISyntaxElement = this;

        while (true) {
            Debug.assert(currentNodeOrToken.kind() != SyntaxKind.None);
            Debug.assert(position >= 0 && position < currentNodeOrToken.fullWidth());

            if (currentNodeOrToken.isToken()) {
                var token = <ISyntaxToken>currentNodeOrToken;
                // Make sure we never return a bogus token.
                Debug.assert(!token.isMissing());
                Debug.assert(token.width() > 0 || token.kind() === SyntaxKind.EndOfFileToken);
                Debug.assert(token.fullWidth() > 0 || token.kind() === SyntaxKind.EndOfFileToken);
                return token;
            }

            var node = <SyntaxNode>currentNodeOrToken;

                //find a child that includes the position
            currentNodeOrToken = node.elementThatContainsPosition(position);
        }
    }

    private elementThatContainsPosition(position: number): ISyntaxElement {
        throw Errors.abstract();
    }
}