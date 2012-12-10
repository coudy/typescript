///<reference path='References.ts' />

class SyntaxRealizer extends SyntaxRewriter {
    constructor() {
        super();
    }

    public visitToken(token: ISyntaxToken): ISyntaxToken {
        return token.realize();
    }
}