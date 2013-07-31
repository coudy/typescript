var Test = (function () {
    function Test() {
    }
    Test.prototype.foo = function () {
        var _this = this;
        var x = function () {
            return _this["prop1"];
        };
        var y = x();
    };
    return Test;
})();
