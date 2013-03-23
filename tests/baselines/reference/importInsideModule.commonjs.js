////[importInsideModule_file1.js]
exports.x = 1;
////[importInsideModule_file2.js]
(function (myModule) {
    var foo = require("./importInsideModule_file1")
    var a = foo.x;
})(importInsideModule_file2.myModule || (importInsideModule_file2.myModule = {}));
var myModule = importInsideModule_file2.myModule;