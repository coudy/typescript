var A = (function () {
    function A() {
    }
    A.prototype.foo = function () {
        /*WScript.Echo("Here!");*/
    };
    return A;
})();

var a = new A();
a.foo();
