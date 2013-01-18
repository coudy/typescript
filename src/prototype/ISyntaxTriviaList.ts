///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxTrivia.ts' />

interface ISyntaxTriviaList extends ISyntaxElement {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;

    hasComment(): bool;
    hasNewLine(): bool;
    hasSkippedText(): bool;

    last(): ISyntaxTrivia;
    toArray(): ISyntaxTrivia[];

    concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;
}