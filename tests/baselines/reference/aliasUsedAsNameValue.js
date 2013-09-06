//// [aliasUsedAsNameValue_0.js]
//// [aliasUsedAsNameValue_1.js]
///<reference path='aliasUsedAsNameValue_0.ts' />
var mod = require("module");
var b = require("Test2");

exports.a = function () {
    //var x = mod.id; // TODO needed hack that mod is loaded
    b.b(mod);
};

