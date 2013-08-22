//// [exportAssignmentClass_A.js]
define(["require", "exports"], function(require, exports) {
    var C = (function () {
        function C() {
            this.p = 0;
        }
        return C;
    })();

    
    return C;
});
//// [exportAssignmentClass_B.js]
define(["require", "exports", "exportAssignmentClass_A"], function(require, exports, __D__) {
    var D = __D__;

    var d = new D();
    var x = d.p;
});
