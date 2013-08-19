// this.call in static generic method not resolved correctly
var A = (function () {
    function A() {
    }
    A.one = function (source, value) {
        return source;
    };

    A.two = function (source) {
        return this.one(source, 42);
    };
    return A;
})();

var B = (function () {
    function B() {
    }
    B.one = function (source, value) {
        return source;
    };

    B.two = function (source) {
        return this.one(source, 42);
    };
    return B;
})();
