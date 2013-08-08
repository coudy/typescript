var C = (function () {
    function C() {
    }
    C.foo = function (x) {
    };
    return C;
})();

var M;
(function (M) {
    function f(x) {
        return new x();
    }
    M.f = f;
})(M || (M = {}));
