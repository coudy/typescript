define(["require", "exports"], function(require, exports) {
    exports.x = 1;

    var Q;
    (function (Q) {
        function foo(x) {
            return x;
        }
        Q.foo = foo;
    })(Q || (Q = {}));

    var Q;
    (function (Q) {
        function bar() {
            Q.foo(null);
        }
    })(Q || (Q = {}));
});
