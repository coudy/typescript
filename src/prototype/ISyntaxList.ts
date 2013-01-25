///<reference path='ISyntaxElement.ts' />
///<reference path='SyntaxNode.ts' />

interface ISyntaxList extends ISyntaxElement {
    count(): number;
    itemAt(index: number): ISyntaxNodeOrToken;
    toArray(): ISyntaxNodeOrToken[];

    insertChildrenInto(array: ISyntaxElement[], index: number): void;
}