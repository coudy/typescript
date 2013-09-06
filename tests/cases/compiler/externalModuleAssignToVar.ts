//@module: amd
// @Filename: externalModuleAssignToVar_ext.ts
class D { }
export = D;

// @Filename: externalModuleAssignToVar_core_require.ts
declare module "ext" {
    export class C { }
}

declare module "ext2" {
    class C { }
    export = C;
}

// @Filename: externalModuleAssignToVar_core.ts
///<reference path='externalModuleAssignToVar_core_require.ts'/>
import ext = require('ext');
var y1: { C: new() => ext.C; } = ext;
y1 = ext; // ok


import ext2 = require('ext2');
var y2: new() => ext2 = ext2;
y2 = ext2; // ok

import ext3 = require('externalModuleAssignToVar_ext');
var y3: new () => ext3 = ext3;
y3 = ext3; // ok
