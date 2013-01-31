///<reference path='..\Syntax\SyntaxNode.ts' />
///<reference path='Accessibility.ts' />
///<reference path='MethodKind.ts' />
///<reference path='ISymbolVisitor.ts' />
///<reference path='SymbolDisplay.ts' />
///<reference path='SymbolKind.ts' />
///<reference path='TypeKind.ts' />
///<reference path='TypeParameterKind.ts' />

interface ISymbol {
    kind(): SymbolKind;

    /// <summary>
    /// Gets the symbol name. Returns the empty string if unnamed.
    /// </summary>
    name(): string;

    childCount(): number;
    childAt(index: number): ISymbol;

    /// <summary>
    /// Gets the immediately containing symbol.
    /// </summary>
    containingSymbol(): ISymbol;

    /// <summary>
    /// Gets the containing type. Returns null if the symbol is not contained within a type.
    /// </summary>
    containingType(): IObjectTypeSymbol;

    /// <summary>
    /// Gets the nearest enclosing module. Returns null if the symbol isn't contained in a module.
    /// </summary>
    containingModule(): IModuleSymbol;

    locations(): ILocation[];

    // True if this symbol is a definition.  False if it not (i.e. it is a constructed generic
    // symbol).
    isDefinition(): bool;

    /// <summary>
    /// Gets the the original definition of the symbol. If this symbol is derived from another symbol,
    /// by type substitution for instance, this gets the original symbol, as it was defined in source.
    /// </summary>
    originalDefinition(): ISymbol;

    // True if this symbol was automatically generated based on the absense of the normal construct
    // that would usually cause it to be created.  For example, a class with no 'constructor' 
    // node will still have a symbol for the constructor synthesized.  
    isImplicitlyDeclared(): bool;

    // Returns true if this symbol can be referenced by its name in code.
    canBeReferencedByName(): bool;

    accessibility(): Accessibility;

    accept(visitor: ISymbolVisitor): any;

    toSymbolDisplayParts(format: SymbolDisplay.Format): SymbolDisplay.Part[];

    isStatic(): bool;
}

interface IGenericSymbol extends ISymbol {
    /// <summary>
    /// Returns the type parameters that this type has. If this is a non-generic type,
    /// returns an empty ReadOnlyArray.  
    /// </summary>
    typeParameters(): ITypeParameterSymbol[];

    /// <summary>
    /// Returns the type arguments that have been substituted for the type parameters. 
    /// If nothing has been substituted for a give type parameters,
    /// then the type parameter itself is consider the type argument.
    /// </summary>
    typeArguments(): ITypeSymbol[];

    /// <summary>
    /// Get the original definition of this type symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IGenericSymbol;
}

interface IModuleOrTypeSymbol extends ISymbol {
}

interface IModuleSymbol extends IModuleOrTypeSymbol {
    isGlobalModule(): bool;
}

/// <summary>
/// Represents a variable in a class, module or enum.
/// </summary>
interface IVariableSymbol extends ISymbol {
    /// <summary>
    /// Gets the type of this field.
    /// </summary>
    type(): ITypeSymbol;

    hasValue(): bool;

    /// <summary>
    /// Gets the constant value of this field
    /// </summary>
    value(): any;

    /// The parameter this variable was created from if it was created from a parameter.
    associatedParameter(): IParameterSymbol;
}

/// <summary>
/// Represents a parameter of a method or property.
/// </summary>
interface IParameterSymbol extends ISymbol
{
    /// <summary>
    /// Returns true if the parameter was declared as a parameter array. 
    /// </summary>
    isRest(): bool;

    /// <summary>
    /// Returns true if the parameter is optional.
    /// </summary>
    isOptional(): bool;

    /// <summary>
    /// Gets the type of the parameter.
    /// </summary>
    type(): ITypeSymbol;

    /// <summary>
    /// Gets the ordinal position of the parameter. The first parameter has ordinal zero.
    /// </summary>
    ordinal(): number;

    /// <summary>
    /// Returns true if the parameter specifies a default value to be passed
    /// when no value is provided as an argument to a call. The default value
    /// can be obtained with the DefaultValue property.
    /// </summary>
    hasValue(): bool;

    /// <summary>
    /// Returns the default value of the parameter. 
    /// </summary>
    value(): any;

    /// The associated variable if this parameter caused a field to be generated.
    associatedVariable(): IVariableSymbol;
}

/// <summary>
/// Represents a method or method-like symbol (including constructor, function, or accessor).
/// </summary>
interface IMethodSymbol extends ISymbol
{
    /// <summary>
    /// Gets what kind of method this is.
    /// </summary>
    methodKind(): MethodKind;

    /// <summary>
    /// Returns the arity of this method, or the number of type parameters it takes.
    /// A non-generic method has zero arity.
    /// </summary>
    arity(): number;

    /// <summary>
    /// Returns whether this method is generic; i.e., does it have any type parameters?
    /// </summary>
    isGenericMethod(): bool;

    /// <summary>
    /// Returns true if this method has no return type; i.e., returns "void".
    /// </summary>
    returnsVoid(): bool;

    /// <summary>
    /// Gets the return type of the method.
    /// </summary>
    returnType(): ITypeSymbol;

    /// <summary>
    /// Returns the type arguments that have been substituted for the type parameters. 
    /// If nothing has been substituted for a given type parameter,
    /// then the type parameter itself is consider the type argument.
    /// </summary>
    typeArguments(): ITypeSymbol[];

    /// <summary>
    /// Get the type parameters on this method. If the method has not generic,
    /// returns an empty list.
    /// </summary>
    typeParameters(): ITypeParameterSymbol[];

    /// <summary>
    /// Gets the parameters of this method. If this method has no parameters, returns
    /// an empty list.
    /// </summary>
    parameters(): IParameterSymbol[];

    /// <summary>
    /// Returns the method symbol that this method was constructed from. The resulting
    /// method symbol
    /// has the same containing type (if any), but has type arguments that are the same
    /// as the type parameters (although its containing type might not).
    /// </summary>
    constructedFrom(): IMethodSymbol;

    /// <summary>
    /// Get the original definition of this symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IMethodSymbol;

    /// <summary>
    /// If this method overrides another method, returns the overridden method.
    /// </summary>
    overriddenMethod(): IMethodSymbol;
}