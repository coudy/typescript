var C = (function () {
    function C(a, b) {
        this.a = a;
        this.b = b;
    }
    C.prototype.foo = function () {
        if (this.a instanceof this.b) {
        }
    };
    return C;
})();
