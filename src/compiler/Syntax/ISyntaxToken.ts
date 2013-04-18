///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxToken extends ISyntaxNodeOrToken, INameSyntax {
        // Same as kind(), just exposed through a property for perf.
        tokenKind: SyntaxKind;

        // Text for this token, not including leading or trailing trivia.
        text(): string;

        value(): any;
        valueText(): string;

        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;

        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;

        hasSkippedToken(): boolean;

        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;

        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;

        clone(): ISyntaxToken;
    }

    export interface ITokenInfo {
        leadingTrivia?: ISyntaxTrivia[];
        text?: string;
        trailingTrivia?: ISyntaxTrivia[];
    }
}