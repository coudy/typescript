///<reference path='References.ts' />

interface ISyntaxTrivia extends ISyntaxElement {
    fullWidth(): number;
    fullText(): string;
}