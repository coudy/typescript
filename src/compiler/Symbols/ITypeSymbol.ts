///<reference path='ISymbol.ts' />

interface ITypeSymbol extends IModuleOrTypeSymbol {
    /// <summary>
    /// An enumerated value that identifies what kind of type this is.
    /// </summary>
    typeKind(): TypeKind;

    /// <summary>
    /// The declared base type of this type, or null.
    /// </summary>
    baseType(): IObjectTypeSymbol;

    /// <summary>
    /// Gets the set of interfaces that this type directly implements. This set does not include
    /// interfaces that are base interfaces of directly implemented interfaces.
    /// </summary>
    interfaces(): IObjectTypeSymbol[];

    /// <summary>
    /// The list of all interfaces of which this type is a declared subtype, excluding this type
    /// itself. This includes all declared base interfaces, all declared base interfaces of base
    /// types, and all declared base interfaces of those results (recursively).  This also is the effective
    /// interface set of a type parameter. Each result
    /// appears exactly once in the list. This list is topologically sorted by the inheritance
    /// relationship: if interface type A extends interface type B, then A precedes B in the
    /// list. This is not quite the same as "all interfaces of which this type is a proper
    /// subtype" because it does not take into account variance: AllInterfaces for
    /// IEnumerable&lt;string&gt; will not include IEnumerble&lt;object&gt;
    /// </summary>
    allInterfaces(): IObjectTypeSymbol[];

    originalDefinition(): ITypeSymbol;
}

interface IObjectTypeSymbol extends ITypeSymbol {
}

interface IClassTypeSymbol extends ITypeSymbol, IGenericSymbol {
    /// <summary>
    /// Get the original definition of this type symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IClassTypeSymbol;

    /// <summary>
    /// Get the constructor for this type.
    /// </summary>
    constructor(): IMethodSymbol;
}

interface IInterfaceTypeSymbol extends ITypeSymbol, IGenericSymbol {
    /// <summary>
    /// Get the original definition of this type symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IInterfaceTypeSymbol;
}

interface IEnumTypeSymbol extends ITypeSymbol {
}

interface IMethodTypeSymbol extends ITypeSymbol, IGenericSymbol {
    /// <summary>
    /// Get the original definition of this type symbol. If this symbol is derived from another
    /// symbol by (say) type substitution, this gets the original symbol, as it was defined in
    /// source.
    /// </summary>
    originalDefinition(): IMethodTypeSymbol;

    returnType(): ITypeSymbol;
    parameters(): IParameterSymbol[];
}

interface IFunctionTypeSymbol extends IMethodTypeSymbol {
}

interface IConstructorTypeSymbol extends IMethodTypeSymbol {

}

interface ITypeParameterSymbol extends ITypeSymbol {
    /// <summary>
    /// The ordinal position of the type parameter in the parameter list which declares
    /// it. The first type parameter has ordinal zero.
    /// </summary>
    ordinal(): number;

    /// <summary>
    /// The type parameter kind of this type parameter.
    /// </summary>
    typeParameterKind(): TypeParameterKind;

    /// <summary>
    /// The method that declares the type parameter, or null.
    /// </summary>
    declaringMethod(): IMethodSymbol;

    /// <summary>
    /// The type that declares the type parameter, or null.
    /// </summary>
    declaringType(): IObjectTypeSymbol;

    /// <summary>
    /// The type that were directly specified as a constraint on the type parameter.
    /// </summary>
    constraintType(): ITypeSymbol;
}

interface IArrayTypeSymbol extends ITypeSymbol {
    /// <summary>
    /// Gets the number of dimensions of this array. A regular single-dimensional array
    /// has rank 1, a two-dimensional array has rank 2, etc.
    /// </summary>
    rank(): number;

    /// <summary>
    /// Gets the type of the elements stored in the array.
    /// </summary>
    elementType(): ITypeSymbol;
}