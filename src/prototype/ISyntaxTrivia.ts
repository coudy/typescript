///<reference path='References.ts' />

interface ISyntaxTrivia extends ISyntaxElement {
    fullStart(): number;
    fullWidth(): number;
    fullText(): string;

    withFullStart(fullStart: number): ISyntaxTrivia;
}