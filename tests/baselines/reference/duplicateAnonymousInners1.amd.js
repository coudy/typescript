var Foo;
(function (Foo) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();

    var Inner = (function () {
        function Inner() {
        }
        return Inner;
    })();

    // Inner should show up in intellisense
    Foo.Outer = 0;
})(Foo || (Foo = {}));

var Foo;
(function (Foo) {
    // Should not be an error
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();
})(Foo || (Foo = {}));
