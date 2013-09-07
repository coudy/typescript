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
define(["require", "exports", 'ext', 'ext2', 'externalModuleAssignToVar_ext'], function(require, exports, ext, ext2, ext3) {
    
    var y1 = ext;
    y1 = ext;

    
    var y2 = ext2;
    y2 = ext2;

    
    var y3 = ext3;
    y3 = ext3;
});
