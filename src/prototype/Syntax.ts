
module Syntax {
    export function emptySourceUnit() {
        return new SourceUnitSyntax(Syntax.emptyList, Syntax.token(SyntaxKind.EndOfFileToken, { text: "" }));
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
               // token1.keywordKind() === token2.keywordKind() &&
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
            if (!Syntax.nodeOrTokenStructuralEquals(list1.itemAt(i), list2.itemAt(i))) {
                return false;
            }
        }

        return true;
    }

    export function separatedListStructuralEquals(list1: ISeparatedSyntaxList, list2: ISeparatedSyntaxList): bool {
        if (list1.itemAndSeparatorCount() !== list2.itemAndSeparatorCount()) {
            return false;
        }

        for (var i = 0, n = list1.itemAndSeparatorCount(); i < n; i++) {
            var element1 = list1.itemOrSeparatorAt(i);
            var element2 = list2.itemOrSeparatorAt(i);
            if (!Syntax.nodeOrTokenStructuralEquals(element1, element2)) {
                return false;
            }
        }

        return true;
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
            (<InvocationExpressionSyntax>node).expression().kind() === SyntaxKind.SuperKeyword;
    }

    export function isSuperInvocationExpressionStatement(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.ExpressionStatement &&
            isSuperInvocationExpression((<ExpressionStatementSyntax>node).expression());
    }

    export function isSuperMemberAccessExpression(node: IExpressionSyntax): bool {
        return node.kind() === SyntaxKind.MemberAccessExpression &&
            (<MemberAccessExpressionSyntax>node).expression().kind() === SyntaxKind.SuperKeyword;
    }

    export function isSuperMemberAccessInvocationExpression(node: SyntaxNode): bool {
        return node.kind() === SyntaxKind.InvocationExpression &&
            isSuperMemberAccessExpression((<InvocationExpressionSyntax>node).expression());
    }

    export function assignmentExpression(left: IExpressionSyntax, token: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax {
        return new BinaryExpressionSyntax(SyntaxKind.AssignmentExpression, left, token, right);
    }
}