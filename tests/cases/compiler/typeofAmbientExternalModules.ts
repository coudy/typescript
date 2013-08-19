//@module: commonjs
declare module "external" {
    export class C { }
}

declare module "exportAssign" {
    class D { }
    export = D;
}

import ext = require('external');
import exp = require('exportAssign');

var y1: typeof ext = ext;
y1 = exp;
var y2: typeof exp = exp;
y2 = ext;