///<reference path='SyntaxNode.ts' />
///<reference path='SymbolDisplay.ts' />

enum SymbolKind {
}

/// <summary>
/// Enumeration for possible kinds of type symbols.
/// </summary>
enum TypeKind {
    /// <summary>
    /// Type's kind is undefined.
    /// </summary>
    Unknown = 0,

    /// <summary>
    /// Type is an array type.
    /// </summary>
    ArrayType = 1,

    /// <summary>
    /// Type is a class.
    /// </summary>
    Class = 2,

    /// <summary>
    /// Type is an enumeration.
    /// </summary>
    Enum = 5,

    /// <summary>
    /// Type is an error type.
    /// </summary>
    Error = 6,

    /// <summary>
    /// Type is an interface.
    /// </summary>
    Interface = 7,

    /// <summary>
    /// Type is a type parameter.
    /// </summary>
    TypeParameter = 11,
}

/// <summary>
/// Represents the different kinds of type parameters.
/// </summary>
enum TypeParameterKind {
    /// <summary>
    /// Type parameter of a named type.  For example: T in List&lt;T&gt;.
    /// </summary>
    Type,

    /// <summary>
    /// Type parameter of a method.  For example: T in "void M&lt;T&gt;()".
    /// </summary>
    Method,
}
/// <summary>
/// Enumeration for possible kinds of method symbols.
/// </summary>
enum MethodKind
{
    /// <summary>
    /// An anonymous method or lambda expression
    /// </summary>
    ArrowFunction = 0,

    /// <summary>
    /// Method is a constructor.
    /// </summary>
    Constructor = 1,

    /// <summary>
    /// Method is an ordinary method.
    /// </summary>
    Ordinary = 10,

    /// <summary>
    /// Method is a property get.
    /// </summary>
    GetAccessor = 11,

    /// <summary>
    /// Method is a property set.
    /// </summary>
    SetAccessor = 12,
}

enum Accessibility {
    NotApplicable,
    Private,
    Public
}

interface ISymbolVisitor {
}

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
    containingType(): INamedTypeSymbol;

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

    toSymbolDisplayParts(format: SymbolDisplayFormat): SymbolDisplayPart[];
}

interface IModuleOrTypeSymbol extends ISymbol {
}

interface IModuleSymbol extends IModuleOrTypeSymbol {
}

interface ITypeSymbol extends IModuleOrTypeSymbol {
    /// <summary>
    /// An enumerated value that identifies what kind of type this is.
    /// </summary>
    typeKind(): TypeKind;

    /// <summary>
    /// The declared base type of this type, or null.
    /// </summary>
    baseType(): INamedTypeSymbol;

    /// <summary>
    /// Gets the set of interfaces that this type directly implements. This set does not include
    /// interfaces that are base interfaces of directly implemented interfaces.
    /// </summary>
    interfaces(): INamedTypeSymbol[];

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
    allInterfaces(): INamedTypeSymbol[];

    originalDefinition(): ITypeSymbol;
}

interface INamedTypeSymbol extends ITypeSymbol {
    /// <summary>
    /// Returns the arity of this type, or the number of type parameters it takes.
    /// A non-generic type has zero arity.
    /// </summary>
    arity(): number;

    /// <summary>
    /// True if this type or some containing type has type parameters.
    /// </summary>
    isGenericType(): bool;

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
    originalDefinition(): INamedTypeSymbol;

    /// <summary>
    /// Get the constructor for this type.
    /// </summary>
    constructor(): IMethodSymbol;
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
    declaringType(): INamedTypeSymbol;

    /// <summary>
    /// The types that were directly specified as constraints on the type parameter.
    /// </summary>
    constraintTypes(): ITypeSymbol[];
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