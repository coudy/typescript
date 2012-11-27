///<reference path='References.ts' />

interface ISyntaxToken {
    kind(): SyntaxKind;
    keywordKind(): SyntaxKind;

    fullStart(): number;
    fullWidth(): number;
    start(): number;
    width(): number;

    isMissing(): bool;

    text(): string;
    fullText(text: IText): string;

    value(): any;
    valueText(): string;

    diagnostics(): DiagnosticInfo[];

    hasLeadingTrivia(): bool;
    hasLeadingCommentTrivia(): bool;
    hasLeadingNewLineTrivia(): bool;

    hasTrailingTrivia(): bool;
    hasTrailingComentTrivia(): bool;
    hasTrailingNewLineTrivia(): bool;

    leadingTrivia(text: IText): ISyntaxTriviaList;
    trailingTrivia(text: IText): ISyntaxTriviaList;
}