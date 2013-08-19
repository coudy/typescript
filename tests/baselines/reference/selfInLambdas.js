var o = {
    counter: 0,
    start: function () {
        var _this = this;
        window.onmousemove = function () {
            _this.counter++;
            var f = function () {
                return _this.counter;
            };
        };
    }
};

var X = (function () {
    function X() {
        this.value = "value";
    }
    X.prototype.foo = function () {
        var _this = this;
        var outer = function () {
            var x = _this.value;
            var inner = function () {
                var y = _this.value;
            };

            inner();
        };
        outer();
    };
    return X;
})();
