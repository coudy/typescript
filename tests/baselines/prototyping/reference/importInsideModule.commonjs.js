////[importInsideModule_file1.js]
exports.x = 1;
////[importInsideModule_file2.js]
var myModule;
(function (myModule) {
    var foo = require("./importInsideModule_file1")
    var a = foo.x;
})(myModule || (myModule = {}));