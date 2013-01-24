///<reference path='SyntaxKind.ts' />

interface ISyntaxElement {
    kind(): SyntaxKind;

    isNode(): bool;
    isToken(): bool;
    isTrivia(): bool;

    isList(): bool;
    isSeparatedList(): bool;
    isTriviaList(): bool;

    // With of this element, including leading and trailing trivia.
    fullWidth(): number;

    // Width of this element, not including leading and trailing trivia.
    width(): number;

    // Text for this element, including leading and trailing trivia.
    fullText(): string;

    leadingTriviaWidth(): number;
    trailingTriviaWidth(): number;
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