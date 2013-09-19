var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.x = function () {
        var _this = 10;
        function inner(_this) {
            var _this = this;
            return function (x) {
                return _this;
            };
        }
    };
    Foo.prototype.y = function () {
        var _this = this;
        var lamda = function (_this) {
            return function (x) {
                return _this;
            };
        };
    };
    Foo.prototype.z = function (_this) {
        var _this = this;
        var lambda = function () {
            return function (x) {
                return _this;
            };
        };
    };

    Foo.prototype.x1 = function () {
        var _this = 10;
        function inner(_this) {
        }
    };
    Foo.prototype.y1 = function () {
        var lamda = function (_this) {
        };
    };
    Foo.prototype.z1 = function (_this) {
        var lambda = function () {
        };
    };
    return Foo;
})();
