var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "X", {
        set: function () {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C, "X", {
        set: function () {
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
