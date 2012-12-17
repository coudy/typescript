///<reference path='Errors.ts' />
///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxToken.ts' />
///<reference path='ISyntaxVisitor.ts' />
///<reference path='SyntaxNodeCloner.ts' />
///<reference path='SyntaxRealizer.ts' />
///<reference path='SyntaxTokenReplacer.ts' />

class SyntaxNode implements ISyntaxElement {
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
        var result: any = { kind: (<any>SyntaxKind)._map[this.kind()] };

        for (var name in this) {
            var value = this[name];
            if (value && typeof value === 'object') {
                result[name] = value;
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

    public fullWidth(): number {
        throw Errors.abstract();
    }

    public clone(): SyntaxNode {
        return this.accept(new SyntaxNodeCloner());
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
}