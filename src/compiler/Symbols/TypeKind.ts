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
    Array = 1,

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

    /// <summary>
    /// Type is a type parameter.
    /// </summary>
    Constructor = 12,

    /// <summary>
    /// Type is a type parameter.
    /// </summary>
    Function = 13,
}