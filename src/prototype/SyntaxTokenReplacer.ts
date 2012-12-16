///<reference path='SyntaxRewriter.generated.ts' />

class SyntaxTokenReplacer extends SyntaxRewriter {
    constructor(private token1: ISyntaxToken,
                private token2: ISyntaxToken) {
        super();
    }

    private visitToken(token: ISyntaxToken): ISyntaxToken {
        return token === this.token1 ? this.token2 : token;
    }
}