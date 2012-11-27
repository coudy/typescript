///<reference path='References.ts' />

interface ISyntaxTriviaList {
    count(): number;
    syntaxTriviaAt(index: number): ISyntaxTrivia;
}