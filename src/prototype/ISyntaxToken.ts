///<reference path='ISyntaxElement.ts' />
///<reference path='ISyntaxTriviaList.ts' />

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

interface ISyntaxNode extends ISyntaxNodeOrToken {
}

interface IModuleReferenceSyntax extends ISyntaxNode {
}

interface IModuleElementSyntax extends ISyntaxNode {
}

interface IStatementSyntax extends IModuleElementSyntax {
}

interface ITypeMemberSyntax extends ISyntaxNode {
}

interface IClassElementSyntax extends ISyntaxNode {
}

interface IMemberDeclarationSyntax extends IClassElementSyntax {
}

interface ISwitchClauseSyntax extends ISyntaxNode {
}

interface IExpressionSyntax extends ISyntaxNodeOrToken {
}

interface IUnaryExpressionSyntax extends IExpressionSyntax {
}

interface ITypeSyntax extends IUnaryExpressionSyntax {
}

interface INameSyntax extends ITypeSyntax {
}

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