
module Syntax {
    export function identifierName(text: string, info: ITokenInfo = null): IdentifierNameSyntax {
        return new IdentifierNameSyntax(identifier(text));
    }
}