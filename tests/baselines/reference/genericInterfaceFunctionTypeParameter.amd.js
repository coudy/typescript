define(["require", "exports"], function(require, exports) {
    function foo(fn) {
        exports.foo(fn);
    }
    exports.foo = foo;
});
