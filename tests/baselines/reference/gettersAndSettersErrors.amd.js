var C = (function () {
    function C() {
        this.Foo = 0;
    }
    Object.defineProperty(C.prototype, "Foo", {
        get: function () {
            return "foo";
        },
        set: function (foo) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(C.prototype, "Goo", {
        get: function (v) {
            return null;
        },
        set: function (v) {
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();
string;
 {
}
get;
Baz();
number;
 {
    return 0;
}
set;
Baz(n, number);
 {
}