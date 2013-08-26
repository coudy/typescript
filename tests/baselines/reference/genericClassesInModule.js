//// [genericClassesInModule.js]
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


////[genericClassesInModule.d.ts]
declare module Foo {
    class B<T> {
    }
    class A {
    }
}
declare var a: Foo.B<Foo.A>;
