var _this = 2;
var a = (function () {
    function a() {
    }
    a.prototype.method1 = function () {
        return {
            doStuff: function (callback) {
                return function () {
                    var _this = 2;
                    return callback(_this);
                };
            }
        };
    };
    a.prototype.method2 = function () {
        var _this = 2;
        return {
            doStuff: function (callback) {
                return function () {
                    return callback(_this);
                };
            }
        };
    };
    return a;
})();
