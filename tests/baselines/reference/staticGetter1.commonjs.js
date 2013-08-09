// once caused stack overflow
var C = (function () {
    function C() {
    }
    Object.defineProperty(C, "x", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
