(function (x) {
    var c = (function () {
        function c() {
        }
        c.prototype.foo = function (a) {
            return a;
        };
        return c;
    })();
    x.c = c;
})(exports.x || (exports.x = {}));
var x = exports.x;

var xc = x.c;
exports.cProp = new xc();
var cReturnVal = exports.cProp.foo(10);

