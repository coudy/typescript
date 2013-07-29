var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "foo", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
