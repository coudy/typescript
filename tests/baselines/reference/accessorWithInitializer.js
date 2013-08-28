// target: es5
var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "X", {
        set: function (v) {
            if (typeof v === "undefined") { v = 0; }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C, "X", {
        set: function (v2) {
            if (typeof v2 === "undefined") { v2 = 0; }
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
