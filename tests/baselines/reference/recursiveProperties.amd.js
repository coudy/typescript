var A = (function () {
    function A() {
    }
    Object.defineProperty(A.prototype, "testProp", {
        get: function () {
            return this.testProp;
        },
        enumerable: true,
        configurable: true
    });
    return A;
})();

var B = (function () {
    function B() {
    }
    Object.defineProperty(B.prototype, "testProp", {
        set: function (value) {
            this.testProp = value;
        },
        enumerable: true,
        configurable: true
    });
    return B;
})();
