//// [exportAssignmentInternalModule_A.js]
define(["require", "exports"], function(require, exports) {
    var M;
    (function (M) {
        M.x;
    })(M || (M = {}));

    
    return M;
});
//// [exportAssignmentInternalModule_B.js]
define(["require", "exports", "exportAssignmentInternalModule_A"], function(require, exports, __modM__) {
    var modM = __modM__;

    var n = modM.x;
});
