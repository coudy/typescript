///<reference path='References.ts' />

interface ISyntaxTriviaList extends ISyntaxElement {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;

    fullWidth(): number;
    fullText(text: IText): string;

    hasComment(): bool;
    hasNewLine(): bool;
}