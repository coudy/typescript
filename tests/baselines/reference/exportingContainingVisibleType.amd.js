define(["require", "exports"], function(require, exports) {
    var Foo = (function () {
        function Foo() {
        }
        Object.defineProperty(Foo.prototype, "foo", {
            get: function () {
                var i;
                return i;
            },
            enumerable: true,
            configurable: true
        });
        return Foo;
    })();

    exports.x = 5;
});
