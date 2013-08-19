var bar;
(function (bar) {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    })();
    bar.Foo = Foo;
})(bar || (bar = {}));
