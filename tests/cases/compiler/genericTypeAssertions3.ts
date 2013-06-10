<<<<<<< HEAD
var r = < <T>(x: T) => T > (x) => { return null; }; // bug was 'could not find dotted symbol T' on x's annotation in the type assertion instead of no error
var s = < <T>(x: T) => T > (x: any) => { return null; }; // no error
=======
function foo<T, U extends T>(x: T, y: U) {
    x = y; // cannot convert U to T
    var z = <T>y; // cannot convert U to T
}
>>>>>>> release-0.9.0
