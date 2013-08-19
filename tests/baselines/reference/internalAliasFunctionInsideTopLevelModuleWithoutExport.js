(function (a) {
    function foo(x) {
        return x;
    }
    a.foo = foo;
})(exports.a || (exports.a = {}));
var a = exports.a;

var b = a.foo;
exports.bVal = b(10);
exports.bVal2 = b;

