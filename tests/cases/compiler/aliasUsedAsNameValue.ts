//@module: commonjs
// @Filename: aliasUsedAsNameValue_0.ts
declare module "module" {
	var id: number;
}

declare module "Test2" {
	function b(a:any): any;
}

// @Filename: aliasUsedAsNameValue_1.ts
///<reference path='aliasUsedAsNameValue_0.ts' />
import mod = require("module");
import b = require("Test2");
 
export var a = function () {
    //var x = mod.id; // TODO needed hack that mod is loaded
    b.b(mod);
}
