///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxToken extends ISyntaxNodeOrToken, INameSyntax {
        // Same as kind(), just exposed through a property for perf.
        tokenKind: SyntaxKind;

        // Text for this token, not including leading or trailing trivia.
        text(): string;

        value(): any;

        hasLeadingTrivia(): bool;
        hasLeadingComment(): bool;
        hasLeadingNewLine(): bool;
        hasLeadingSkippedText(): bool;

        hasTrailingTrivia(): bool;
        hasTrailingComment(): bool;
        hasTrailingNewLine(): bool;
        hasTrailingSkippedText(): bool;

        hasSkippedText(): bool;

        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;

        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;

        clone(): ISyntaxToken;
    }

    export interface ITokenInfo {
        leadingTrivia?: ISyntaxTrivia[];
        text?: string;
        value?: any;
        trailingTrivia?: ISyntaxTrivia[];
    }
}