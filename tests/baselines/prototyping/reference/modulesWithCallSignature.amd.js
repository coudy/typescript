var m;
(function (m) {
    var Foo = (function () {
        function Foo() {
            this.c = 10;
        }
        return Foo;
    })();
    m.Foo = Foo;    
        m.d = 10;
    })(m || (m = {}));
var x = m();
var newedVal = new m();
////[0.d.ts]
module m {
    class Foo {
        public c: number;
    }
    function (): Foo;
    var d: number;
    function new(): string;
}
var x: m.Foo;
var newedVal: string;