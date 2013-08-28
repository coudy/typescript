var M;
(function (M) {
    M.x = 1;
    function f() {
    }
    M.f = f;

    (function (N) {
        var C = (function () {
            function C() {
            }
            return C;
        })();
        N.C = C;
    })(M.N || (M.N = {}));
    var N = M.N;
})(M || (M = {}));
