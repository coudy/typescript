///<reference path='ISyntaxElement.ts' />

interface ISyntaxTrivia extends ISyntaxElement {
    fullWidth(): number;
    fullText(): string;
}