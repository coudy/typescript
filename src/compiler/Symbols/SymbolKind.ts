enum SymbolKind {
    Module,
    Parameter,

    // Types
    ObjectType,
    ClassType,
    InterfaceType,
    EnumType,
    FunctionType,
    ConstructorType,
    TypeParameter,
    ArrayType,

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