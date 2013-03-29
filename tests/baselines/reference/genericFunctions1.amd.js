function foo(x) {
    return x;
}
var x = foo(5);
////[0.d.ts]
function foo<T>(x: T): T;
var x: number;