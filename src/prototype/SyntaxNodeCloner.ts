///<reference path='SyntaxRewriter.generated.ts' />

class SyntaxNodeCloner extends SyntaxRewriter {
    // TODO: We may need to clone nodes with no tokens in them (like an OmittedExpressionSyntax).

    private visitToken(token: ISyntaxToken): ISyntaxToken {
        return token.clone();
    }
}