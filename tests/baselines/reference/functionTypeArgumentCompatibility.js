function f() {
    var x;
    var y;
    x = y;
    return x;
}

var C = (function () {
    function C() {
    }
    C.prototype.f = function () {
        var x;
        var y;
        x = y;
        return x;
    };
    return C;
})();
