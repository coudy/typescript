///<reference path='References.ts' />

interface ISyntaxToken extends ISyntaxElement {
    // Same as syntaxKind, just exposed through a property for perf.
    kind: SyntaxKind;
    keywordKind(): SyntaxKind;

    fullStart(): number;
    fullWidth(): number;
    fullEnd(): number;

    start(): number;
    width(): number;
    end(): number;

    isMissing(): bool;

    text(): string;
    fullText(text: IText): string;

    value(): any;
    valueText(): string;

    hasLeadingTrivia(): bool;
    hasLeadingCommentTrivia(): bool;
    hasLeadingNewLineTrivia(): bool;

    hasTrailingTrivia(): bool;
    hasTrailingCommentTrivia(): bool;
    hasTrailingNewLineTrivia(): bool;

    leadingTrivia(text: IText): ISyntaxTriviaList;
    trailingTrivia(text: IText): ISyntaxTriviaList;
}