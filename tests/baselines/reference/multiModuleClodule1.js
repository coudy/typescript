var C = (function () {
    function C(x) {
    }
    C.prototype.foo = function () {
    };
    C.prototype.bar = function () {
    };
    C.boo = function () {
    };
    return C;
})();

var C;
(function (C) {
    C.x = 1;
    var y = 2;
})(C || (C = {}));
var C;
(function (C) {
    function foo() {
    }
    C.foo = foo;
    function baz() {
        return '';
    }
})(C || (C = {}));

var c = new C(C.x);
c.foo = C.foo;
