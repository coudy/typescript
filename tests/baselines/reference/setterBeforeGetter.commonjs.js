var Foo = (function () {
    function Foo() {
    }
    Object.defineProperty(Foo.prototype, "bar", {
        get: function () {
            return this._bar;
        },
        set: // should not be an error to order them this way
        function (thing) {
            this._bar = thing;
        },
        enumerable: true,
        configurable: true
    });
    return Foo;
})();
