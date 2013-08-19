var MyClass = (function () {
    function MyClass() {
    }
    Object.defineProperty(MyClass.prototype, "Count", {
        get: function () {
            return 42;
        },
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });

    return MyClass;
})();
//# sourceMappingURL=properties.js.map
