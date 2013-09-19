var console;
var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.x = function () {
        var _this = 10;
        function inner() {
            var _this = this;
            console.log(_this);
            return function (x) {
                return _this;
            };
        }
    };
    return Foo;
})();
