var o = {
    counter: 0,
    start: function () {
        var _this = this;
        window.onmousemove = function () {
            //console.log("iteration: " + this.counter++);
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
        var outer = function () {
            //console.log(this.value); // works as expected
            var inner = function () {
                //console.log(this.value); // is undefined
            };

            inner();
        };
        outer();
    };
    return X;
})();
