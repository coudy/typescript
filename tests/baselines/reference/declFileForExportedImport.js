//// [declFileForExportedImport.js]
var a = require('m');
exports.a = a;
var y = exports.a.x;

var b = require(a);
exports.b = b;
var z = exports.b.x;



////[declFileForExportedImport.d.ts]
export declare module 'm' {
    var x: number;
}
export import a = require('m');
export import b = a;
