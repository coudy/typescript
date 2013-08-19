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


