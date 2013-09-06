// @declaration: true
// @module: commonjs
// @Filename: declFileForExportedImport_0.ts
declare module 'm' {
    export var x: number;
}

// @Filename: declFileForExportedImport_1.ts
///<reference path='declFileForExportedImport_0.ts'/>
export import a = require('m');
var y = a.x;

export import b = a;
var z = b.x;