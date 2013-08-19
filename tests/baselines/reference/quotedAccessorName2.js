var C = (function () {
    function C() {
    }
    Object.defineProperty(C, "foo", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
