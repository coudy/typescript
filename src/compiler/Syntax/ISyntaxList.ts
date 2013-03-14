///<reference path='ISyntaxElement.ts' />
///<reference path='SyntaxNode.ts' />

module TypeScript {
    export interface ISyntaxList extends ISyntaxElement {
        childAt(index: number): ISyntaxNodeOrToken;
        toArray(): ISyntaxNodeOrToken[];

        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}