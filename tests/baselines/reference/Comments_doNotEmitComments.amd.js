var myVariable = 10;
function foo(p) {
}
var fooVar;
foo(50);
fooVar();
var c = (function () {
    function c() {
        this.b = 10;
    }
    c.prototype.myFoo = function () {
        return this.b;
    };
    Object.defineProperty(c.prototype, "prop1", {
        get: function () {
            return this.b;
        },
        set: function (val) {
            this.b = val;
        },
        enumerable: true,
        configurable: true
    });
    c.prototype.foo1 = function (aOrb) {
        return aOrb.toString();
    };
    return c;
})();
var i = new c();
var i1_i;
var m1;
(function (m1) {
    var b = (function () {
        function b(x) {
            this.x = x;
        }
        return b;
    })();
    m1.b = b;    
    })(m1 || (m1 = {}));
////[0.d.ts]
var myVariable: number;
function foo(p: number): void;
var fooVar: () => void;
class c {
    constructor();
    public b: number;
    public myFoo(): number;
    public prop1 : number;
    public foo1(a: number): string;
    public foo1(b: string): string;
}
var i: c;
interface i1 {
    (a: number): number;
    new(b: string);
    [a: number]: string;
    myFoo(a: number): string;
    prop: string;
}
var i1_i: i1;
module m1 {
    export class b {
        public x: number;
        constructor(x: number);
    }
    export module m2 {
    }
}