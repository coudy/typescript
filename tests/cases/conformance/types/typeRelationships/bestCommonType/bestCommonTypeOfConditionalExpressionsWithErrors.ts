function foo5<T, U>(t: T, u: U): Object {
    return true ? t : u; // Error because BCT fails => {}, then {} is not identical to T, U, or Object
}

function foo2<T extends U, U>(t: T, u: U) { // Error for referencing own type parameter
    return true ? t : u; // Ok because BCT(T, U) = U
}