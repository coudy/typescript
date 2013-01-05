////[comments_ExternalModules_1.js]
var extMod = require("./comments_ExternalModules_0")
extMod.m1.fooExport();
exports.newVar = new extMod.m1.m2.c();
////[0.d.ts]
////[comments_ExternalModules_0.d.ts]
////[comments_ExternalModules_1.d.ts]
import extMod = module ("comments_ExternalModules_0");
export var newVar: extMod.m1.m2.c;