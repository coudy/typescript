///<reference path='ISyntaxElement.ts' />
///<reference path='SyntaxNode.ts' />

interface ISyntaxList extends ISyntaxElement {
    childAt(index: number): ISyntaxNodeOrToken;
    toArray(): ISyntaxNodeOrToken[];

    insertChildrenInto(array: ISyntaxElement[], index: number): void;
}