var X = (function () {
    function X() {
    }
    X.prototype.f = function (t) {
        return { a: t };
    };
    return X;
})();

var x;
var t1 = x.f(5);
t1.a = 5;
