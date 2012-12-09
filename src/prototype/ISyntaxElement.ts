///<reference path='References.ts' />

interface ISyntaxElement {
    kind(): SyntaxKind;

    isToken(): bool;
    isNode(): bool;
    isList(): bool;
    isSeparatedList(): bool;
    isTriviaList(): bool;
    isTrivia(): bool;
    isMissing(): bool;

    collectTextElements(text: IText, elements: string[]): void;
}