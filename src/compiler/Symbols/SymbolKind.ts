enum SymbolKind {
    Module,
    Parameter,

    // Types
    AnyType,
    NumberType,
    BooleanType,
    StringType,
    VoidType,
    NullType,
    UndefinedType,
    ObjectType,
    ClassType,
    InterfaceType,
    ArrayType,
    AnonymousType,
    EnumType,
    TypeParameter,

    // Members
    Constructor,
    Function,
    Variable,

    // Signatures
    CallSignature,
    ConstructSignature,
    IndexSignature,
    PropertySignature,
    FunctionSignature,
}