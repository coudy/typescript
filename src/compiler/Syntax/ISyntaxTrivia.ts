///<reference path='ISyntaxElement.ts' />

interface ISyntaxTrivia {
    kind(): SyntaxKind;

    isWhitespace(): bool;
    isComment(): bool;
    isNewLine(): bool;
    isSkippedText(): bool;

    // With of this trivia.
    fullWidth(): number;

    // Text for this trivia.
    fullText(): string;
}