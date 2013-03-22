var M;
(function (M) {
    function f(p) {
        f;
        var i;
        f(i);
        f(f(i));
        f((f(f(i))));
    }
    M.f = f;
})(M || (M = {}));