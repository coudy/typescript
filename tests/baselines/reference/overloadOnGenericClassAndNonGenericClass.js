var A = (function () {
    function A() {
    }
    return A;
})();
var B = (function () {
    function B() {
    }
    return B;
})();
var C = (function () {
    function C() {
    }
    return C;
})();
var X = (function () {
    function X() {
    }
    return X;
})();
var X1 = (function () {
    function X1() {
    }
    return X1;
})();
var X2 = (function () {
    function X2() {
    }
    return X2;
})();

function f(a) {
}

//var x1: X1;
//var x2: X2;
var xs;

//var xn: X<number>;
//var t1 = f(x1);
//var t1: A; // OK
//var t2 = f(x2);
//var t2: A; // OK
var t3 = f(xs);
var t3;
