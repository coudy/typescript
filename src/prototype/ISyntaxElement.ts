///<reference path='SyntaxKind.ts' />

interface ISyntaxElement {
    kind(): SyntaxKind;

    isNode(): bool;
    isToken(): bool;
    isTrivia(): bool;

    isList(): bool;
    isSeparatedList(): bool;
    isTriviaList(): bool;

    // With of this element, including leading and trailing trivia.
    fullWidth(): number;

    // Text for this element, including leading and trailing trivia.
    fullText(): string;
}