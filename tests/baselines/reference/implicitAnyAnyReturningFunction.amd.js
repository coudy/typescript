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
declare function A();
declare function B();
declare class C {
    public A();
    public B();
}
