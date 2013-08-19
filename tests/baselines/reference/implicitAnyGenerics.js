var C = (function () {
    function C() {
    }
    return C;
})();

var c = new C();
var c2 = new C();
var c3 = new C();
var c4 = new C();

var D = (function () {
    function D(x) {
    }
    return D;
})();

var d = new D(null);
var d2 = new D(1);
var d3 = new D(1);
var d4 = new D(1);
var d5 = new D(null);

function foo() {
    return null;
}
;
foo();
foo();
