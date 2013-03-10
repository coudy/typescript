///<reference path='SyntaxKind.ts' />
///<reference path='ISyntaxToken.ts' />

interface ISyntaxElement {
    kind(): SyntaxKind;

    isNode(): bool;
    isToken(): bool;
    isList(): bool;
    isSeparatedList(): bool;

    childCount(): number;
    childAt(index: number): ISyntaxElement;

    // True if this element is typescript specific and would not be legal in pure javascript.
    isTypeScriptSpecific(): bool;

    // True if this element (or any child element) contains any skipped text trivia.
    hasSkippedText(): bool;

    // True if this element (or any child element) contains any zero width tokens.
    hasZeroWidthToken(): bool;

    // True if this element (or any child element) contains any regular expression token.
    hasRegularExpressionToken(): bool;

    // With of this element, including leading and trailing trivia.
    fullWidth(): number;

    // Width of this element, not including leading and trailing trivia.
    width(): number;

    // Text for this element, including leading and trailing trivia.
    fullText(): string;

    leadingTrivia(): ISyntaxTriviaList;
    trailingTrivia(): ISyntaxTriviaList;

    leadingTriviaWidth(): number;
    trailingTriviaWidth(): number;

    firstToken(): ISyntaxToken;
    lastToken(): ISyntaxToken;

    collectTextElements(elements: string[]): void;
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

interface IEnumElementSyntax extends ISyntaxNode {
}