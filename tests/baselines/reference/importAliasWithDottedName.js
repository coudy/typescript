var M;
(function (M) {
    M.x = 1;
    (function (N) {
        N.y = 2;
    })(M.N || (M.N = {}));
    var N = M.N;
})(M || (M = {}));

var A;
(function (A) {
    var N = M.N;
    var r = N.y;
    var r2 = M.N.y;
})(A || (A = {}));
