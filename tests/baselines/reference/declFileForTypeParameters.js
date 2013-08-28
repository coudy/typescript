//// [declFileForTypeParameters.js]
var C = (function () {
    function C() {
    }
    C.prototype.foo = function (a) {
        return this.x;
    };
    return C;
})();


////[declFileForTypeParameters.d.ts]
declare class C<T> {
    public x: T;
    public foo(a: T): T;
}
