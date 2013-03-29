var C = (function () {
    function C() { }
    return C;
})();
var a;
var b;
a = b;
////[0.d.ts]
class C<T> {
    private x;
}
interface X {
    f(): string;
}
interface Y {
    f(): string;
}
var a: C<X>;
var b: C<Y>;