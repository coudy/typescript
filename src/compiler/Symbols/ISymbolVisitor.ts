///<reference path='ISymbol.ts' />

interface ISymbolVisitor {
    visitArrayType(symbol: IArrayTypeSymbol): any;
    visitClassType(symbol: IClassTypeSymbol): any;
    visitInterfaceType(symbol: IInterfaceTypeSymbol): any;
    visitObjectType(symbol: IObjectTypeSymbol): any;
    visitTypeParameter(symbol: ITypeParameterSymbol): any;
    visitVariable(symbol: IVariableSymbol): any;
}