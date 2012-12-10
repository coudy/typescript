///<reference path='References.ts' />

interface ISyntaxTriviaList extends ISyntaxElement {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;

    fullWidth(): number;
    fullText(): string;

    hasComment(): bool;
    hasNewLine(): bool;
}