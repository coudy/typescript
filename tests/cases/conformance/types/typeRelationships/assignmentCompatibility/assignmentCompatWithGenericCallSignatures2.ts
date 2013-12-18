// some complex cases of assignment compat of generic signatures that stress contextual signature instantiation

interface A {
    <T>(x: T, ...y: T[][]): void
}

interface B {
    <S>(x: S, ...y: S[]): void
}

var a: A;
var b: B;

// BUG 843490
a = b; // should be error?
b = a; // should be error?
