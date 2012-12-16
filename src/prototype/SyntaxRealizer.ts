///<reference path='SyntaxRewriter.generated.ts' />

class SyntaxRealizer extends SyntaxRewriter {
    constructor() {
        super();
    }

    public visitToken(token: ISyntaxToken): ISyntaxToken {
        return token.realize();
    }
}