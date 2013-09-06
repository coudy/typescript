//// [importDecl_require.js]
//// [importDecl_1.js]
///<reference path='importDecl_require.ts'/>
var m4 = require("m4");
exports.x4 = m4.x;
exports.d4 = m4.d;
exports.f4 = m4.foo();

(function (m1) {
    m1.x2 = m4.x;
    m1.d2 = m4.d;
    m1.f2 = m4.foo();

    var x3 = m4.x;
    var d3 = m4.d;
    var f3 = m4.foo();
})(exports.m1 || (exports.m1 = {}));
var m1 = exports.m1;

//Emit global only usage
var glo_m4 = require("glo_m4");
exports.useGlo_m4_x4 = glo_m4.x;
exports.useGlo_m4_d4 = glo_m4.d;
exports.useGlo_m4_f4 = glo_m4.foo();

//Emit even when used just in function type
var fncOnly_m4 = require("fncOnly_m4");
exports.useFncOnly_m4_f4 = fncOnly_m4.foo();

// only used privately no need to emit
var private_m4 = require("private_m4");
(function (usePrivate_m4_m1) {
    var x3 = private_m4.x;
    var d3 = private_m4.d;
    var f3 = private_m4.foo();
})(exports.usePrivate_m4_m1 || (exports.usePrivate_m4_m1 = {}));
var usePrivate_m4_m1 = exports.usePrivate_m4_m1;

// Do not emit unused import
var m5 = require("m5");
exports.d = m5.foo2();

// Do not emit multiple used import statements
var multiImport_m4 = require("m4");
exports.useMultiImport_m4_x4 = multiImport_m4.x;
exports.useMultiImport_m4_d4 = multiImport_m4.d;
exports.useMultiImport_m4_f4 = multiImport_m4.foo();



////[importDecl_require.d.ts]
declare module "m4" {
    class d {
    }
    var x: d;
    function foo(): d;
}
declare module "glo_m4" {
    class d {
    }
    var x: d;
    function foo(): d;
}
declare module "fncOnly_m4" {
    class d {
    }
    var x: d;
    function foo(): d;
}
declare module "private_m4" {
    class d {
    }
    var x: d;
    function foo(): d;
}
declare module "m5" {
    import m4 = require("m4");
    function foo2(): m4.d;
}
////[importDecl_1.d.ts]
/// <reference path="importDecl_require.d.ts" />
import m4 = require("m4");
export declare var x4: m4.d;
export declare var d4: new() => m4.d;
export declare var f4: m4.d;
export declare module m1 {
    var x2: m4.d;
    var d2: new() => m4.d;
    var f2: m4.d;
}
import glo_m4 = require("glo_m4");
export declare var useGlo_m4_x4: glo_m4.d;
export declare var useGlo_m4_d4: new() => glo_m4.d;
export declare var useGlo_m4_f4: glo_m4.d;
import fncOnly_m4 = require("fncOnly_m4");
export declare var useFncOnly_m4_f4: fncOnly_m4.d;
export declare module usePrivate_m4_m1 {
}
export declare var d: m4.d;
export declare var useMultiImport_m4_x4: m4.d;
export declare var useMultiImport_m4_d4: new() => m4.d;
export declare var useMultiImport_m4_f4: m4.d;
