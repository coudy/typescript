// once caused stack overflow
var C = (function () {
    function C() {
    }
    C.x = function () {
        var r = this;
        return this;
    };
    return C;
})();
