var A = (function () {
    function A() {
    }
    A.one = function (source, value) {
        return source;
    };
    A.goo = function () {
        return 0;
    };

    A.two = function (source) {
        return this.one(source, 42);
    };
    return A;
})();
