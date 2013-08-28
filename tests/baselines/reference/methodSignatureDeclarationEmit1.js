//// [methodSignatureDeclarationEmit1.js]
var C = (function () {
    function C() {
    }
    C.prototype.foo = function (a) {
    };
    return C;
})();


////[methodSignatureDeclarationEmit1.d.ts]
declare class C {
    public foo(n: number): void;
    public foo(s: string): void;
}
