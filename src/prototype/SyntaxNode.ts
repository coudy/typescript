///<reference path='References.ts' />

class SyntaxNode {
    public kind(): SyntaxKind {
        throw Errors.abstract();
    }

    public isMissing(): bool {
        return false;
    }
}