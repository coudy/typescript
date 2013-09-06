// @module: amd
// @Filename: instanceOfInExternalModules_require.ts
declare module "FS" {
    export class Foo { }
}

// @Filename: instanceOfInExternalModules_1.ts
///<reference path='instanceOfInExternalModules_require.ts'/>
import Bar = require("FS");
function IsFoo(value: any): boolean {
    return value instanceof Bar.Foo;
}
