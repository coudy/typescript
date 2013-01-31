///<reference path='ISymbol.ts' />
///<reference path='ITypeSymbol.ts' />

interface ISignatureSymbol extends ISymbol {
    type(): ITypeSymbol;
}

interface ICallSignatureSymbol extends IParameterizedSymbol, IGenericSymbol {
}

interface IConstructSignatureSymbol extends IParameterizedSymbol, IGenericSymbol {
}

interface IIndexSignatureSymbol extends IParameterizedSymbol {
}

interface IPropertySignature extends ISignatureSymbol {
    isOptional(): bool;
}

interface IFunctionSignatureSymbol extends IParameterizedSymbol, IGenericSymbol {
    isOptional(): bool;
}