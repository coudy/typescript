var C = (function () {
    function C() {
    }
    return C;
})();
exports.C = C;


var D = (function () {
    function D() {
    }
    return D;
})();

module.exports = D;


var ext = require("./typeofExternalModules_external");
var exp = require("./typeofExternalModules_exportAssign");

var y1 = ext;
y1 = exp;
var y2 = exp;
y2 = ext;

