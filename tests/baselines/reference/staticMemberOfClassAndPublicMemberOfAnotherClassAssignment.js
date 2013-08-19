var B = (function () {
    function B() {
    }
    B.prototype.name = function () {
    };
    return B;
})();
var C = (function () {
    function C() {
    }
    C.name = function () {
    };
    return C;
})();

var a = new B();
a = new C();
a = B;
a = C;

var b = new C();
b = B;
b = C;
b = a;

var c = new B();
c = B;
c = C;
c = a;
