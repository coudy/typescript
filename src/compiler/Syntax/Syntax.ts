/// <reference path='SyntaxFactory.generated.ts' />

module Syntax {
    export function emptySourceUnit() {
        return Syntax.normalModeFactory.sourceUnit(Syntax.emptyList, Syntax.token(SyntaxKind.EndOfFileToken, { text: "" }));
    }

    export function getStandaloneExpression(positionedToken: PositionedToken): PositionedNodeOrToken
    {
        var token = positionedToken.token();
        if (positionedToken !== null && positionedToken.kind() === SyntaxKind.IdentifierName) {
            var parentPositionedNode = positionedToken.containingNode();
            var parentNode = parentPositionedNode.node();

            if (parentNode.kind() === SyntaxKind.QualifiedName && (<QualifiedNameSyntax>parentNode).right === token) {
                return parentPositionedNode;
            }
            else if (parentNode.kind() === SyntaxKind.MemberAccessExpression && (<MemberAccessExpressionSyntax>parentNode).name === token) {
                return parentPositionedNode;
            }
        }

        return positionedToken;
    }

    export function isInModuleOrTypeContext(positionedToken: PositionedToken): bool {
        if (positionedToken !== null) {
            var positionedNodeOrToken = Syntax.getStandaloneExpression(positionedToken);
            var parent = positionedNodeOrToken.containingNode();

            if (parent !== null) {
                switch (parent.kind()) {
                    case SyntaxKind.ModuleNameModuleReference:
                        return true;
                    case SyntaxKind.QualifiedName:
                        // left of QN is namespace or type.  Note: when you have "a.b.c()", then
                        // "a.b" is not a qualified name, it is a member access expression.
                        // Qualified names are only parsed when the parser knows it's a type only
                        // context.
                        return true;
                    default:
                        return isInTypeOnlyContext(positionedToken);
                }
            }
        }

        return false;
    }

    export function isInTypeOnlyContext(positionedToken: PositionedToken): bool {
        var positionedNodeOrToken = Syntax.getStandaloneExpression(positionedToken);
        var positionedParent = positionedNodeOrToken.containingNode();

        var parent = positionedParent.node();
        var nodeOrToken = positionedNodeOrToken.nodeOrToken();

        if (parent !== null) {
            switch (parent.kind()) {
                case SyntaxKind.ArrayType:
                    return (<ArrayTypeSyntax>parent).type === nodeOrToken;
                case SyntaxKind.CastExpression:
                    return (<CastExpressionSyntax>parent).type === nodeOrToken;
                case SyntaxKind.TypeAnnotation:
                case SyntaxKind.ExtendsClause:
                case SyntaxKind.ImplementsClause:
                case SyntaxKind.TypeArgumentList:
                    return true;
                // TODO: add more cases if necessary.  This list may not be complete.
            }
        }

        return false;
    }

    export function childOffset(parent: ISyntaxElement, child: ISyntaxElement): number {
        var offset = 0;
        for (var i = 0, n = parent.childCount(); i < n; i++) {
            var current = parent.childAt(i);
            if (current === child) {
                return offset;
            }

            if (current !== null) {
                offset += current.fullWidth();
            }
        }

        throw Errors.invalidOperation();
    }

    export function nodeStructuralEquals(node1: SyntaxNode, node2: SyntaxNode): bool {
        if (node1 === null) {
            return node2 === null;
        }

        return node1.structuralEquals(node2);
    }

    export function nodeOrTokenStructuralEquals(node1: ISyntaxNodeOrToken, node2: ISyntaxNodeOrToken): bool {
        if (node1 === node2) {
            return true;
        }

        if (node1 === null || node2 === null) {
            return false;
        }

        if (node1.isToken()) {
            return node2.isToken() ? tokenStructuralEquals(<ISyntaxToken>node1, <ISyntaxToken>node2) : false;
        }

        return node2.isNode() ? nodeStructuralEquals(<SyntaxNode>node1, <SyntaxNode>node2) : false;
    }

    export function tokenStructuralEquals(token1: ISyntaxToken, token2: ISyntaxToken): bool {
        if (token1 === token2) {
            return true;
        }

        if (token1 === null || token2 === null) {
            return false;
        }

        return token1.kind() === token2.kind() &&
               token1.width() === token2.width() &&
               token1.fullWidth() === token2.fullWidth() &&
               token1.text() === token2.text() &&
               Syntax.triviaListStructuralEquals(token1.leadingTrivia(), token2.leadingTrivia()) &&
               Syntax.triviaListStructuralEquals(token1.trailingTrivia(), token2.trailingTrivia());
    }

    export function triviaListStructuralEquals(triviaList1: ISyntaxTriviaList, triviaList2: ISyntaxTriviaList): bool {
        if (triviaList1.count() !== triviaList2.count()) {
            return false;
        }

        for (var i = 0, n = triviaList1.count(); i < n; i++) {
            if (!Syntax.triviaStructuralEquals(triviaList1.syntaxTriviaAt(i), triviaList2.syntaxTriviaAt(i))) {
                return false;
            }
        }

        return true;
    }

    export function triviaStructuralEquals(trivia1: ISyntaxTrivia, trivia2: ISyntaxTrivia): bool {
        return trivia1.kind() === trivia2.kind() &&
               trivia1.fullWidth() === trivia2.fullWidth() &&
               trivia1.fullText() === trivia2.fullText();
    }

    export function listStructuralEquals(list1: ISyntaxList, list2: ISyntaxList): bool {
        if (list1.childCount() !== list2.childCount()) {
            return false;
        }

        for (var i = 0, n = list1.childCount(); i < n; i++) {
            if (!Syntax.nodeOrTokenStructuralEquals(list1.childAt(i), list2.childAt(i))) {
                return false;
            }
        }

        return true;
    }

    export function separatedListStructuralEquals(list1: ISeparatedSyntaxList, list2: ISeparatedSyntaxList): bool {
        if (list1.childCount() !== list2.childCount()) {
            return false;
        }

        for (var i = 0, n = list1.childCount(); i < n; i++) {
            var element1 = list1.childAt(i);
            var element2 = list2.childAt(i);
            if (!Syntax.nodeOrTokenStructuralEquals(element1, element2)) {
                return false;
            }
        }

        return true;
    }
    
    export function elementStructuralEquals(element1: ISyntaxElement, element2: ISyntaxElement) {
        if (element1 === element2) {
            return true;
        }

        if (element1 === null || element2 === null) {
            return false;
        }

        if (element2.kind() !== element2.kind()) {
            return false;
        }

        if (element1.isToken()) {
            return tokenStructuralEquals(<ISyntaxToken>element1, <ISyntaxToken>element2);
        }
        else if (element1.isNode()) {
            return nodeStructuralEquals(<SyntaxNode>element1, <SyntaxNode>element2) ;
        }
        else if (element1.isList()) {
            return listStructuralEquals(<ISyntaxList>element1, <ISyntaxList>element2);
        }
        else if (element1.isSeparatedList()) {
            return separatedListStructuralEquals(<ISeparatedSyntaxList>element1, <ISeparatedSyntaxList>element2);
        }

        throw Errors.invalidOperation();
    }

    export function identifierName(text: string, info: ITokenInfo = null): ISyntaxToken {
        return identifier(text);
    }

    export function callSignature(parameter: ParameterSyntax): CallSignatureSyntax {
        return CallSignatureSyntax.create1().withParameterList(
            ParameterListSyntax.create1().withParameter(parameter));
    }

    export function trueExpression(): IUnaryExpressionSyntax {
        return Syntax.token(SyntaxKind.TrueKeyword);
    }

    export function falseExpression(): IUnaryExpressionSyntax {
        return Syntax.token(SyntaxKind.FalseKeyword);
    }

    export function numericLiteralExpression(text: string): IUnaryExpressionSyntax {
        return Syntax.token(SyntaxKind.NumericLiteral, { text: text });
    }

    export function stringLiteralExpression(text: string): IUnaryExpressionSyntax {
        return Syntax.token(SyntaxKind.StringLiteral, { text: text });
    }

    export function isSuperInvocationExpression(node: IExpressionSyntax): bool {
        return node.kind() === SyntaxKind.InvocationExpression &&
            (<InvocationExpressionSyntax>node).expression.kind() === SyntaxKind.SuperKeyword;
    }

    export function isSuperInvocationExpressionStatement(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.ExpressionStatement &&
            isSuperInvocationExpression((<ExpressionStatementSyntax>node).expression);
    }

    export function isSuperMemberAccessExpression(node: IExpressionSyntax): bool {
        return node.kind() === SyntaxKind.MemberAccessExpression &&
            (<MemberAccessExpressionSyntax>node).expression.kind() === SyntaxKind.SuperKeyword;
    }

    export function isSuperMemberAccessInvocationExpression(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.InvocationExpression &&
            isSuperMemberAccessExpression((<InvocationExpressionSyntax>node).expression);
    }

    export function assignmentExpression(left: IExpressionSyntax, token: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
        return Syntax.normalModeFactory.binaryExpression(SyntaxKind.AssignmentExpression, left, token, right);
    }
}