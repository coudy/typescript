var M;
(function (M) {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    })();
    M.Foo = Foo;
    var bar = function () {
    };
})(M || (M = {}));
