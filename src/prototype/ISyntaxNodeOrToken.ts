interface ISyntaxNodeOrToken extends ISyntaxElement {
    firstToken(): ISyntaxToken;
    lastToken(): ISyntaxToken;
    hasSkippedText(): bool;
    isTypeScriptSpecific(): bool;
    hasZeroWidthToken(): bool;
    hasRegularExpressionToken(): bool;

    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    width(): number;

    leadingTriviaWidth(): number;
    trailingTriviaWidth(): number;
    
    withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;
    withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;

    accept(visitor: ISyntaxVisitor): any;
}