//// [declFileForClassWithPrivateOverloadedFunction.js]
var C = (function () {
    function C() {
    }
    C.prototype.foo = function (x) {
    };
    return C;
})();


////[declFileForClassWithPrivateOverloadedFunction.d.ts]
declare class C {
    private foo(x);
}
