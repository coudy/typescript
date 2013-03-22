///<reference path='References.ts' />

module TypeScript {
    export interface ISyntaxElement {
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

    export interface ISyntaxNode extends ISyntaxNodeOrToken {
    }

    export interface IModuleReferenceSyntax extends ISyntaxNode {
    }

    export interface IModuleElementSyntax extends ISyntaxNode {
    }

    export interface IStatementSyntax extends IModuleElementSyntax {
    }

    export interface ITypeMemberSyntax extends ISyntaxNode {
    }

    export interface IClassElementSyntax extends ISyntaxNode {
    }

    export interface IMemberDeclarationSyntax extends IClassElementSyntax {
    }

    export interface ISwitchClauseSyntax extends ISyntaxNode {
    }

    export interface IExpressionSyntax extends ISyntaxNodeOrToken {
    }

    export interface IUnaryExpressionSyntax extends IExpressionSyntax {
    }

    export interface ITypeSyntax extends IUnaryExpressionSyntax {
    }

    export interface INameSyntax extends ITypeSyntax {
    }
}