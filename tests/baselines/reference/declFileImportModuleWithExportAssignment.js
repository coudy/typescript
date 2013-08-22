//// [declFileImportModuleWithExportAssignment_0.js]
var m2;

module.exports = m2;

//// [declFileImportModuleWithExportAssignment_1.js]
/**This is on import declaration*/
var a1 = require("declFileImportModuleWithExportAssignment_0");
exports.a = a1;
exports.a.test1(null, null, null);

