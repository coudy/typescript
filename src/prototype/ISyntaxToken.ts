///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxTriviaList.ts' />

interface ISyntaxToken extends ISyntaxElement {
    keywordKind(): SyntaxKind;

    width(): number;
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