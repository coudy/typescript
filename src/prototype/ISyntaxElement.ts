///<reference path='References.ts' />

interface ISyntaxElement {
    kind(): SyntaxKind;

    isToken(): bool;
    isNode(): bool;
    isList(): bool;
    isSeparatedList(): bool;
}