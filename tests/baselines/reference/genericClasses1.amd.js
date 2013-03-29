var C = (function () {
    function C() { }
    return C;
})();
var v1 = new C();
var y = v1.x;
////[0.d.ts]
class C<T> {
    public x: T;
}
var v1: C<string>;
var y: string;