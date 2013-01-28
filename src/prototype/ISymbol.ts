///<reference path='SyntaxNode.ts' />
///<reference path='SymbolDisplay.ts' />

enum SymbolKind {
}

enum Accessibility {
    Private,
    Public
}

interface ISymbolVisitor {
}

interface ISymbol {
    kind(): SymbolKind;

    name(): string;
    containingSymbol(): ISymbol;

    childCount(): number;
    childAt(index: number): ISymbol;

    locations(): SyntaxNode[];
    
    // True if this symbol is a definition.  False if it not (i.e. it is a constructed generic
    // symbol).
    isDefinition(): bool;

    // True if this symbol was automatically generated based on the absense of the normal construct
    // that would usually cause it to be created.  For example, a class with no 'constructor' 
    // node will still have a symbol for the constructor synthesized.  
    isImplicitlyDeclared(): bool;

    // Returns true if this symbol can be referenced by its name in code.
    canBeReferencedByName(): bool;

    accessibility(): Accessibility;

    accept(visitor: ISymbolVisitor): any;

    toSymbolDisplayParts(format: SymbolDisplayFormat): SymbolDisplayPart[];
}

interface IModuleSymbol extends ISymbol {

}