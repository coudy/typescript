////[exportEqualsClass_A.js]
var C = (function () {
    function C() {
        this.p = 0;
    }
    return C;
})();


    module.exports = C;

////[exportEqualsClass_B.js]


var d = new D();
var x = d.p;
