var Foo = (function () {
    function Foo() { }
    Object.defineProperty(Foo.prototype, "value", {
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Foo.prototype, "keys", {
        get: function () {
            return keys('b');
        },
        enumerable: true,
        configurable: true
    });
    return Foo;
})();
function keys(val) {
    return [
        val
    ];
}