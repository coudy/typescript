
module Syntax {
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
}