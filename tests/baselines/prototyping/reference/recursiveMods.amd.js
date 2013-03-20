define(["require", "exports"], function(require, exports) {
    (function (Foo) {
        var C = (function () {
            function C() { }
            return C;
        })();
        Foo.C = C;        
    })(0.Foo || (0.Foo = {}));
    var Foo = 0.Foo;
    (function (Foo) {
        function Bar() {
            if (true) {
                return Bar();
            }
            return new Foo.C();
        }
        function Baz() {
            var c = Baz();
            return Bar();
        }
        function Gar() {
            var c = Baz();
            return;
        }
    })(0.Foo || (0.Foo = {}));
    var Foo = 0.Foo;
})