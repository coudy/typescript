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
    /** function comment */
    c.prototype.myFoo = function () {
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


    /** overload implementation signature*/
    c.prototype.foo1 = function (aOrb) {
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
