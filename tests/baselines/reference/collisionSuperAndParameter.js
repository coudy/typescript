var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.a = function () {
        var _this = this;
        var lamda = function (_super) {
            return function (x) {
                return _this;
            };
        };
    };
    Foo.prototype.b = function (_super) {
        var _this = this;
        var lambda = function () {
            return function (x) {
                return _this;
            };
        };
    };
    return Foo;
})();
var Foo2 = (function (_super) {
    __extends(Foo2, _super);
    function Foo2() {
        _super.apply(this, arguments);
    }
    Foo2.prototype.x = function () {
        var _this = this;
        var lamda = function (_super) {
            return function (x) {
                return _this;
            };
        };
    };
    Foo2.prototype.y = function (_super) {
        var _this = this;
        var lambda = function () {
            return function (x) {
                return _this;
            };
        };
    };
    return Foo2;
})(Foo);
