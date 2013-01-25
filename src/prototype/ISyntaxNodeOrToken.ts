interface ISyntaxNodeOrToken extends ISyntaxElement {
    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;
    withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;

    accept(visitor: ISyntaxVisitor): any;
}