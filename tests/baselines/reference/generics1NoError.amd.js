var v1;
var v2;
var v4;
var v5;
var v7;
////[0.d.ts]
interface A {
    a: string;
}
interface B extends A {
    b: string;
}
interface C extends B {
    c: string;
}
interface G<T, U extends B> {
    x: T;
    y: U extends B;
}
var v1: G<A, C>;
var v2: G<{ a: string; }, C>;
var v4: G<G<any, any>, C>;
var v5: G<any, any>;
var v7: G<any, any>;