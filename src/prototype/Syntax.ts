
module Syntax {
    export function identifierName(text: string, info: ITokenInfo = null): IdentifierNameSyntax {
        return new IdentifierNameSyntax(identifier(text));
    }

    export function callSignature(parameter: ParameterSyntax): CallSignatureSyntax {
        return CallSignatureSyntax.create1().withParameterList(
            ParameterListSyntax.create1().withParameter(parameter));
    }
}