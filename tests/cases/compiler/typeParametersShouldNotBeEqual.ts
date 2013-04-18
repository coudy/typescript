function ff<T, U>(x: T, y: U) {
    var z: Object;
    x = x;  // Ok
    x = y;  // Should be error but isn’t
    x = z;  // Should be error but isn’t
    z = x;  // Ok
}
