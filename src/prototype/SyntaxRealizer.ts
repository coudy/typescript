///<reference path='References.ts' />

class SyntaxRealizer extends SyntaxRewriter {
    private text: IText;

    constructor(text: IText) {
        super();

        this.text = text;
    }

    public visitToken(token: ISyntaxToken): ISyntaxToken {
        return token.realize(this.text);
    }
}