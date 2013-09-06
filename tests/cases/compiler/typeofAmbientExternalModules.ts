//@module: commonjs
// @Filename: typeofAmbientExternalModules_0.ts
declare module "external" {
    export class C { }
}

declare module "exportAssign" {
    class D { }
    export = D;
}
// @Filename: typeofAmbientExternalModules_1.ts
///<reference path='typeofAmbientExternalModules_0.ts'/>
import ext = require('external');
import exp = require('exportAssign');

var y1: typeof ext = ext;
y1 = exp;
var y2: typeof exp = exp;
y2 = ext;