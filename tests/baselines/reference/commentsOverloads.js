function f1(aOrb) {
    return 10;
}
f1("hello");
f1(10);

/** this is f2 var comment*/
function f2(aOrb) {
    return 10;
}
f2("hello");
f2(10);

function f3(aOrb) {
    return 10;
}
f3("hello");
f3(10);

function f4(aOrb) {
    return 10;
}
f4("hello");
f4(10);

var i1_i;

var i2_i;

var i3_i;

var c = (function () {
    function c() {
    }
    c.prototype.prop1 = function (aorb) {
        return 10;
    };

    c.prototype.prop2 = function (aorb) {
        return 10;
    };

    c.prototype.prop3 = function (aorb) {
        return 10;
    };

    c.prototype.prop4 = function (aorb) {
        return 10;
    };

    /** Prop5 implementaion*/
    c.prototype.prop5 = function (aorb) {
        return 10;
    };
    return c;
})();
var c1 = (function () {
    function c1(aorb) {
    }
    return c1;
})();
var c2 = (function () {
    function c2(aorb) {
    }
    return c2;
})();
var c3 = (function () {
    function c3(aorb) {
    }
    return c3;
})();
var c4 = (function () {
    /** c4 3 */
    function c4(aorb) {
    }
    return c4;
})();
var c5 = (function () {
    /** c5 implementation*/
    function c5(aorb) {
    }
    return c5;
})();
var c_i = new c();

var c1_i_1 = new c1(10);
var c1_i_2 = new c1("hello");
var c2_i_1 = new c2(10);
var c2_i_2 = new c2("hello");
var c3_i_1 = new c3(10);
var c3_i_2 = new c3("hello");
var c4_i_1 = new c4(10);
var c4_i_2 = new c4("hello");
var c5_i_1 = new c5(10);
var c5_i_2 = new c5("hello");
