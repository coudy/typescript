///<reference path='ISyntaxElement.ts' />

interface ISeparatedSyntaxList extends ISyntaxElement {
    count();
    itemAt(index: number): ISyntaxElement;

    toArray(): ISyntaxElement[];
    toSyntaxNodeArray(): SyntaxNode[];

    syntaxNodeCount();
    syntaxNodeAt(index: number): SyntaxNode;

    separatorCount();
    separatorAt(index: number): ISyntaxToken;

    firstToken(): ISyntaxToken;
    lastToken(): ISyntaxToken;
}