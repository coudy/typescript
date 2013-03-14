///<reference path='ISyntaxElement.ts' />
///<reference path='SyntaxNode.ts' />

module TypeScript {
    export interface ISeparatedSyntaxList extends ISyntaxElement {
        childAt(index: number): ISyntaxNodeOrToken;

        toArray(): ISyntaxNodeOrToken[];
        toNonSeparatorArray(): ISyntaxNodeOrToken[];

        separatorCount();
        separatorAt(index: number): ISyntaxToken;

        nonSeparatorCount();
        nonSeparatorAt(index: number): ISyntaxNodeOrToken;

        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}