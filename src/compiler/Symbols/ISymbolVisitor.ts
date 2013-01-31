///<reference path='ISymbol.ts' />

interface ISymbolVisitor {
    visitArrayType(symbol: IArrayTypeSymbol): any;
    visitTypeParameter(symbol: ITypeParameterSymbol): any;
    visitObjectType(symbol: IObjectTypeSymbol): any;
    visitVariable(symbol: IVariableSymbol): any;
}