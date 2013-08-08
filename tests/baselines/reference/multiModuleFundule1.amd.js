function C(x) {
}

var C;
(function (C) {
    C.x = 1;
})(C || (C = {}));
var C;
(function (C) {
    function foo() {
    }
    C.foo = foo;
})(C || (C = {}));

var r = C(2);
var r2 = new C(2);
var r3 = C.foo();
