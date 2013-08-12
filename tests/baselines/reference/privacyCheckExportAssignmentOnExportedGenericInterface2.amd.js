define(["require", "exports"], function(require, exports) {
    

    function Foo(array) {
        return undefined;
    }

    var Foo;
    (function (Foo) {
        Foo.x = "hello";
    })(Foo || (Foo = {}));
    return Foo;
});
