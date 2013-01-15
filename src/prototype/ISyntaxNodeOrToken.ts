interface ISyntaxNodeOrToken extends ISyntaxElement {
    firstToken(): ISyntaxToken;
    lastToken(): ISyntaxToken;
    hasSkippedText(): bool;
    isTypeScriptSpecific(): bool;
    hasZeroWidthToken(): bool;
    hasRegularExpressionToken(): bool;

    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;
    withTrailingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;

    accept(visitor: ISyntaxVisitor): any;
}