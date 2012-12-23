
module Syntax {
    export var emptySourceUnit = new SourceUnitSyntax(Syntax.emptyList, Syntax.token(SyntaxKind.EndOfFileToken, { text: "" }));

    export function nodeStructuralEquals(node1: SyntaxNode, node2: SyntaxNode): bool {
        if (node1 === null) {
            return node2 === null;
        }

        return node1.structuralEquals(node2);
    }

    export function tokenStructuralEquals(token1: ISyntaxToken, token2: ISyntaxToken): bool {
        if (token1 === token2) {
            return true;
        }

        if (token1 === null || token2 === null) {
            return false;
        }

        return token1.kind() === token2.kind() &&
               token1.keywordKind() === token2.keywordKind() &&
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
        if (list1.count() !== list2.count()) {
            return false;
        }

        for (var i = 0, n = list1.count(); i < n; i++) {
            if (!Syntax.nodeStructuralEquals(list1.syntaxNodeAt(i), list2.syntaxNodeAt(i))) {
                return false;
            }
        }

        return true;
    }

    export function separatedListStructuralEquals(list1: ISeparatedSyntaxList, list2: ISeparatedSyntaxList): bool {
        if (list1.count() !== list2.count()) {
            return false;
        }

        for (var i = 0, n = list1.count(); i < n; i++) {
            var element1 = list1.itemAt(i);
            var element2 = list2.itemAt(i);
            if (i % 2 === 0) {
                if (!Syntax.nodeStructuralEquals(<SyntaxNode>element1, <SyntaxNode>element2)) {
                    return false;
                }
            }
            else {
                if (!Syntax.tokenStructuralEquals(<ISyntaxToken>element1, <ISyntaxToken>element2)) {
                    return false;
                }
            }
        }

        return true;
    }
    
    export function identifierName(text: string, info: ITokenInfo = null): IdentifierNameSyntax {
        return new IdentifierNameSyntax(identifier(text));
    }

    export function callSignature(parameter: ParameterSyntax): CallSignatureSyntax {
        return CallSignatureSyntax.create1().withParameterList(
            ParameterListSyntax.create1().withParameter(parameter));
    }

    export function trueExpression(): LiteralExpressionSyntax {
        return new LiteralExpressionSyntax(
            SyntaxKind.BooleanLiteralExpression,
            Syntax.token(SyntaxKind.TrueKeyword));
    }

    export function falseExpression(): LiteralExpressionSyntax {
        return new LiteralExpressionSyntax(
            SyntaxKind.BooleanLiteralExpression,
            Syntax.token(SyntaxKind.FalseKeyword));
    }

    export function numericLiteralExpression(text: string): LiteralExpressionSyntax {
        return new LiteralExpressionSyntax(
            SyntaxKind.NumericLiteralExpression,
            Syntax.token(SyntaxKind.NumericLiteral, { text: text }));
    }

    export function stringLiteralExpression(text: string): LiteralExpressionSyntax {
        return new LiteralExpressionSyntax(
            SyntaxKind.StringLiteralExpression,
            Syntax.token(SyntaxKind.StringLiteral, { text: text }));
    }

    export function isSuperInvocationExpression(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.InvocationExpression &&
            (<InvocationExpressionSyntax>node).expression().kind() === SyntaxKind.SuperExpression;
    }

    export function isSuperInvocationExpressionStatement(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.ExpressionStatement &&
            isSuperInvocationExpression((<ExpressionStatementSyntax>node).expression());
    }

    export function isSuperMemberAccessExpression(node: ExpressionSyntax): bool {
        return node.kind() === SyntaxKind.MemberAccessExpression &&
            (<MemberAccessExpressionSyntax>node).expression().kind() === SyntaxKind.SuperExpression;
    }

    export function isSuperMemberAccessInvocationExpression(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.InvocationExpression &&
            isSuperMemberAccessExpression((<InvocationExpressionSyntax>node).expression());
    }

    export function assignmentExpression(left: ExpressionSyntax, token: ISyntaxToken, right: ExpressionSyntax): BinaryExpressionSyntax {
        return new BinaryExpressionSyntax(SyntaxKind.AssignmentExpression, left, token, right);
    }
}