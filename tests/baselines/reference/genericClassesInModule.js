var Foo;
(function (Foo) {
    var B = (function () {
        function B() {
        }
        return B;
    })();
    Foo.B = B;

    var A = (function () {
        function A() {
        }
        return A;
    })();
    Foo.A = A;
})(Foo || (Foo = {}));

var a = new Foo.B();
