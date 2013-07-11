// bug 15937: Constructor parameter initializers should disallow this
// this should not compiler, this reference in in
// constructor parameter initializer not allowed
var Foo = (function () {
    function Foo(x) {
        if (typeof x === "undefined") { x = this.y; }
    }
    return Foo;
})();
