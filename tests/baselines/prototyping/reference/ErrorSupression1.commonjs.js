var Foo = (function () {
    function Foo() { }
    Foo.bar = function bar() {
        return "x";
    };
    return Foo;
})();
var baz = Foo.b;
baz.concat("y");