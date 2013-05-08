////[exportEqualsClass_A.js]
define(["require", "exports"], function(require, exports) {
    var C = (function () {
        function C() {
            this.p = 0;
        }
        return C;
    })();

    
});
////[exportEqualsClass_B.js]
define(["require", "exports"], function(require, exports) {
    

    var d = new D();
    var x = d.p;
});