var C = (function () {
    function C() { }
    return C;
})();
var a;
var b;
////[0.d.ts]
class C<T> {
    private x;
}
interface X {
    f(): string;
}
interface Y {
    f(): bool;
}
var a: C<X>;
var b: C<Y>;