///<reference path='References.ts' />

interface ISyntaxToken extends ISyntaxElement {
    // Same as syntaxKind, just exposed through a property for perf.
    tokenKind: SyntaxKind;
    keywordKind(): SyntaxKind;

    fullStart(): number;
    fullWidth(): number;
    fullEnd(): number;

    start(): number;
    width(): number;
    end(): number;

    text(): string;
    fullText(): string;

    value(): any;
    valueText(): string;

    hasLeadingTrivia(): bool;
    hasLeadingCommentTrivia(): bool;
    hasLeadingNewLineTrivia(): bool;

    hasTrailingTrivia(): bool;
    hasTrailingCommentTrivia(): bool;
    hasTrailingNewLineTrivia(): bool;

    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    realize(): ISyntaxToken;

    withFullStart(fullStart: number): ISyntaxToken;
    withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
    withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
}

interface IElasticToken {
    kind: SyntaxKind;
    keywordKind?: SyntaxKind;
    leadingTrivia?: ISyntaxTrivia[];
    text?: string;
    trailingTrivia?: ISyntaxTrivia[];
}