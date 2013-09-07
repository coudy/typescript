//// [declFileForExportedImport_0.js]
//// [declFileForExportedImport_1.js]
///<reference path='declFileForExportedImport_0.ts'/>
var a = require('m');
exports.a = a;
var y = exports.a.x;

var b = a;
exports.b = b;
var z = exports.b.x;



////[declFileForExportedImport_0.d.ts]
declare module 'm' {
    var x: number;
}
////[declFileForExportedImport_1.d.ts]
/// <reference path="declFileForExportedImport_0.d.ts" />
export import a = require('m');
export import b = a;
