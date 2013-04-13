///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxList<T extends ISyntaxNodeOrToken> extends ISyntaxElement {
        childAt(index: number): T;
        toArray(): ISyntaxNodeOrToken[];

        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}