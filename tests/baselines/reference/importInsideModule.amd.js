////[importInsideModule_file1.js]
define(["require", "exports"], function(require, exports) {
    exports.x = 1;
})
////[importInsideModule_file2.js]
define(["require", "exports", "importInsideModule_file1"], function(require, exports, __foo__) {
    (function (myModule) {
        var foo = __foo__;

        var a = foo.x;
    })(importInsideModule_file2.myModule || (importInsideModule_file2.myModule = {}));
    var myModule = importInsideModule_file2.myModule;
})