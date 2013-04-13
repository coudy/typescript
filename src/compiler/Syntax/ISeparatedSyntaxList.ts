///<reference path='References.ts' />

module TypeScript {
    export interface ISeparatedSyntaxList<T extends ISyntaxNodeOrToken> extends ISyntaxElement {
        childAt(index: number): T;

        toArray(): ISyntaxNodeOrToken[];
        toNonSeparatorArray(): T[];

        separatorCount();
        separatorAt(index: number): ISyntaxToken;

        nonSeparatorCount();
        nonSeparatorAt(index: number): T;

        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}