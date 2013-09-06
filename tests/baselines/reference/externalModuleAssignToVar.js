//// [externalModuleAssignToVar_core_require.js]
//// [externalModuleAssignToVar_ext.js]
define(["require", "exports"], function(require, exports) {
    var D = (function () {
        function D() {
        }
        return D;
    })();
    
    return D;
});
//// [externalModuleAssignToVar_core.js]
define(["require", "exports", 'ext', 'ext2', 'externalModuleAssignToVar_ext'], function(require, exports, __ext__, __ext2__, __ext3__) {
    ///<reference path='externalModuleAssignToVar_core_require.ts'/>
    var ext = __ext__;
    var y1 = ext;
    y1 = ext;

    var ext2 = __ext2__;
    var y2 = ext2;
    y2 = ext2;

    var ext3 = __ext3__;
    var y3 = ext3;
    y3 = ext3;
});
