var C1 = (function () {
    function C1() {
    }
    C1.foo1 = function (a) {
    };
    return C1;
})();
var C2 = (function () {
    function C2() {
    }
    C2.prototype.foo2 = function (a) {
    };
    return C2;
})();
var C3 = (function () {
    function C3() {
    }
    C3.prototype.foo3 = function (a) {
    };
    return C3;
})();
var C4 = (function () {
    function C4() {
    }
    C4.foo4 = function (a) {
    };
    return C4;
})();
var C5 = (function () {
    function C5() {
    }
    C5.prototype.foo5 = function (a) {
    };

    C5.foo5 = function (a) {
    };
    return C5;
})();
