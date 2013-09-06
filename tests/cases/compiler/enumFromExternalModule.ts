//@module: commonjs
// @Filename: enumFromExternalModule_0.ts
declare module 'filexx' {
    export enum Mode { Open }
}

// @Filename: enumFromExternalModule_1.ts
///<reference path='enumFromExternalModule_0.ts'/>
import f = require('filexx');

var x = f.Mode.Open;
