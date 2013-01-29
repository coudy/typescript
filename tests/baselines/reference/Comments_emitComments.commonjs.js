/** Variable comments*/
var myVariable = 10;
/** function comments*/
function foo(/** parameter comment*/ p) {
}
/** variable with function type comment*/
var fooVar;
foo(50);
fooVar();
/**class comment*/
var c = (function () {
    /** constructor comment*/
    function c() {
        /** property comment */
        this.b = 10;
    }
    c.prototype.myFoo = /** function comment */
    function () {
        return this.b;
    };
    Object.defineProperty(c.prototype, "prop1", {
        get: /** getter comment*/
        function () {
            return this.b;
        },
        set: /** setter comment*/
        function (val) {
            this.b = val;
        },
        enumerable: true,
        configurable: true
    });
    c.prototype.foo1 = /** overload implementation signature*/
    function (aOrb) {
        return aOrb.toString();
    };
    return c;
})();
/**instance comment*/
var i = new c();
/**interface instance comments*/
var i1_i;
/** this is module comment*/
var m1;
(function (m1) {
    /** class b */
    var b = (function () {
        function b(x) {
            this.x = x;
        }
        return b;
    })();
    m1.b = b;    
    })(m1 || (m1 = {}));
////[0.d.ts]
/** Variable comments*/
var myVariable: number;
/** function comments*/
function foo(/** parameter comment*/ p: number): void;
/** variable with function type comment*/
var fooVar: () => void;
/**class comment*/
class c {
    /** constructor comment*/
    constructor();
    /** property comment */
    public b: number;
    /** function comment */
    public myFoo(): number;
    /** getter comment*/
    /** setter comment*/
    public prop1 : number;
    /** overload signature1*/
    public foo1(a: number): string;
    /** Overload signature 2*/
    public foo1(b: string): string;
}
/**instance comment*/
var i: c;
/** interface comments*/
interface i1 {
    /** caller comments*/
    (a: number): number;
    /** new comments*/
    new(b: string);
    /**indexer property*/
    [a: number]: string;
    /** function property;*/
    myFoo(a: number): string;
    /** prop*/
    prop: string;
}
/**interface instance comments*/
var i1_i: i1;
/** this is module comment*/
module m1 {
    /** class b */
    export class b {
        public x: number;
        constructor(x: number);
    }
    export module m2 {
    }
}