function f1(x) {
    return null;
}

function f2(x) {
    return null;
}

function f3(x) {
    return null;
}

function f4(x) {
    return undefined;
}

var g;

g = f1;

g = f2;

g = f3;

g = f4;

var C = (function () {
    function C(x) {
    }
    return C;
})();

var d;

d = C;// Error

