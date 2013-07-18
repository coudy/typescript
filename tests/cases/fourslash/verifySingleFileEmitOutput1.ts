/// <reference path='fourslash.ts' />

// This is file_0.ts
////export class A {
////}

// This is file_1.ts
////import f = require("file_0");
////class B extends f.A {
////}

debugger;

goTo.file("file_0.ts");
verify.numberOfErrorsInCurrentFile(0);

goTo.file("file_1.ts");
verify.numberOfErrorsInCurrentFile(0);

verify.amdEmitOutputForCurrentFileIs(
'var __extends = this.__extends || function (d, b) {\r\n' +
'    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\r\n' +
'    function __() { this.constructor = d; }\r\n' +
'    __.prototype = b.prototype;\r\n' +
'    d.prototype = new __();\r\n' +
'};\r\n' +
'var f = require("./file_0");\r\n' +
'var B = (function (_super) {\r\n' +
'    __extends(B, _super);\r\n' +
'    function B() {\r\n' +
'        _super.apply(this, arguments);\r\n' +
'    }\r\n' +
'    return B;\r\n' +
'})(f.A);\r\n\r\n');
