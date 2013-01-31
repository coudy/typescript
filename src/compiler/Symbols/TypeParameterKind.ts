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