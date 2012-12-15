///<reference path='References.ts' />

interface ISeparatedSyntaxList extends ISyntaxElement {
    count();
    itemAt(index: number): ISyntaxElement;

    syntaxNodeCount();
    syntaxNodeAt(index: number): SyntaxNode;

    separatorCount();
    separatorAt(index: number): ISyntaxToken;

    firstToken(): ISyntaxToken;
    lastToken(): ISyntaxToken;
}