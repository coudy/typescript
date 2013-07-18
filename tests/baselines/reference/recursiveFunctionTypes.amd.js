function fn() {
    return 1;
}

var x = fn;
var y = fn;

var f;
var g;

function f1(d) {
}

function f2() {
}
function g2() {
}

function f3() {
    return f3;
}

var a = f3;

var C = (function () {
    function C() {
    }
    C.g = function (t) {
    };
    return C;
})();
C.g(3);

var f4;
f4 = 3;

function f5() {
    return f5;
}

function f6(a) {
    return f6;
}

f6("", 3);
f6("");
f6();

f7("", 3);
f7("");
f7();// ok

