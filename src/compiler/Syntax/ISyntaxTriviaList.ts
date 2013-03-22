///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxTriviaList {
        count(): number;
        syntaxTriviaAt(index: number): ISyntaxTrivia;

        // With of this trivia list.
        fullWidth(): number;

        // Text for this trivia list.
        fullText(): string;

        hasComment(): bool;
        hasNewLine(): bool;
        hasSkippedText(): bool;

        last(): ISyntaxTrivia;
        toArray(): ISyntaxTrivia[];

        concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;

        collectTextElements(elements: string[]): void;
    }
}