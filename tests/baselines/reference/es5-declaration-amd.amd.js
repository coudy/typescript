var A = (function () {
    function A() {
    }
    A.prototype.B = function () {
        return 42;
    };
    return A;
})();
////[0.d.ts]
class A {
    constructor();
    public B(): number;
}