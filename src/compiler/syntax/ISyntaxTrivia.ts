///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxTrivia {
        kind(): SyntaxKind;

        isWhitespace(): boolean;
        isComment(): boolean;
        isNewLine(): boolean;
        isSkippedToken(): boolean;

        // With of this trivia.
        fullWidth(): number;

        // Text for this trivia.
        fullText(): string;

        // If this is a skipped token trivia, then this was the token that was skipped.
        skippedToken(): ISyntaxToken;
    }
}