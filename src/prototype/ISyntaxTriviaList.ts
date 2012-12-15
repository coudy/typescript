///<reference path='References.ts' />

interface ISyntaxTriviaList extends ISyntaxElement {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;

    hasComment(): bool;
    hasNewLine(): bool;

    last(): ISyntaxTrivia;
    toArray(): ISyntaxTrivia[];

    concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;
}