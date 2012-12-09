///<reference path='References.ts' />

interface ISyntaxTriviaList {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;

    fullWidth(): number;
    fullText(text: IText): string;

    hasComment(): bool;
    hasNewLine(): bool;
}