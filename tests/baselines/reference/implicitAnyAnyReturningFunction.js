//// [implicitAnyAnyReturningFunction.js]
function A() {
    return "";
}

function B() {
    var someLocal = {};
    return someLocal;
}

var C = (function () {
    function C() {
    }
    C.prototype.A = function () {
        return "";
    };

    C.prototype.B = function () {
        var someLocal = {};
        return someLocal;
    };
    return C;
})();


////[implicitAnyAnyReturningFunction.d.ts]
declare function A(): any;
declare function B(): any;
declare class C {
    public A(): any;
    public B(): any;
}
