///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxTriviaList.ts' />
///<reference path='SyntaxVisitor.generated.ts' />

interface ISyntaxToken extends ISyntaxElement, INameSyntax {
    // Same as kind(), just exposed through a property for perf.
    tokenKind: SyntaxKind;

    // Width of this token, not including leading or trailing trivia.
    width(): number;

    // Text for this token, not including leading or trailing trivia.
    text(): string;

    value(): any;

    hasLeadingTrivia(): bool;
    hasLeadingComment(): bool;
    hasLeadingNewLine(): bool;
    hasLeadingSkippedText(): bool;
    leadingTriviaWidth(): number;

    hasTrailingTrivia(): bool;
    hasTrailingComment(): bool;
    hasTrailingNewLine(): bool;
    hasTrailingSkippedText(): bool;
    trailingTriviaWidth(): number;

    hasSkippedText(): bool;

    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
    withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;

    clone(): ISyntaxToken;
}

interface ITokenInfo {
    leadingTrivia?: ISyntaxTrivia[];
    text?: string;
    value?: any;
    trailingTrivia?: ISyntaxTrivia[];
}