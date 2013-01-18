///<reference path='ISyntaxElement.ts' />

interface ISyntaxTrivia extends ISyntaxElement {
    isComment(): bool;
    isNewLine(): bool;
    isSkippedText(): bool;
}