var x = function () {
    return;
};
var r1 = x();
var y = x;
var r2 = y();

var c;
var r3 = c();

var C = (function () {
    function C() {
        this.prototype = null;
        this.length = 1;
        this.arguments = null;
        this.caller = function () {
        };
    }
    return C;
})();
var c2;
var r4 = c2();

var z;
var r5 = z(1);
