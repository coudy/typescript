///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxTrivia {
        kind(): SyntaxKind;

        isWhitespace(): boolean;
        isComment(): boolean;
        isNewLine(): boolean;
        isSkippedText(): boolean;

        // With of this trivia.
        fullWidth(): number;

        // Text for this trivia.
        fullText(): string;
    }
}