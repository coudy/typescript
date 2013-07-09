////[typeofExternalModules_external.js]
define(["require", "exports"], function(require, exports) {
    var C = (function () {
        function C() {
        }
        return C;
    })();
    exports.C = C;
});

////[typeofExternalModules_exportAssign.js]
define(["require", "exports"], function(require, exports) {
    var D = (function () {
        function D() {
        }
        return D;
    })();
    
    return D;
});

////[typeofExternalModules_core.js]
define(["require", "exports", 'typeofExternalModules_external', 'typeofExternalModules_exportAssign'], function(require, exports, __ext__, __exp__) {
    var ext = __ext__;
    var exp = __exp__;

    var y1 = ext;
    y1 = exp;
    var y2 = exp;
    y2 = ext;
});
