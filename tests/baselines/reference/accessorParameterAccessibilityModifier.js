// target: es5
var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "X", {
        set: function (v) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C, "X", {
        set: function (v2) {
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
