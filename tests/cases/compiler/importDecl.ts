//@module: commonjs
// @declaration: true
// @Filename: importDecl_require.ts
declare module "m4" {
    export class d {
    }
    var x: d;
    export function foo(): d;
}

declare module "glo_m4" {
    export class d {
    }
    var x: d;
    export function foo(): d;
}

declare module "fncOnly_m4" {
    export class d {
    }
    var x: d;
    export function foo(): d;
}

declare module "private_m4" {
    class d {
    }
    export var x: d;
    export function foo(): d;
}

declare module "m5" {
    import m4 = require("m4");
    export function foo2(): m4.d;
}

// @Filename: importDecl_1.ts
///<reference path='importDecl_require.ts'/>
import m4 = require("m4"); // Emit used
export var x4 = m4.x;
export var d4 = m4.d;
export var f4 = m4.foo();

export module m1 {
    export var x2 = m4.x;
    export var d2 = m4.d;
    export var f2 = m4.foo();

    var x3 = m4.x;
    var d3 = m4.d;
    var f3 = m4.foo();
}

//Emit global only usage
import glo_m4 = require("glo_m4");
export var useGlo_m4_x4 = glo_m4.x;
export var useGlo_m4_d4 = glo_m4.d;
export var useGlo_m4_f4 = glo_m4.foo();

//Emit even when used just in function type
import fncOnly_m4 = require("fncOnly_m4");
export var useFncOnly_m4_f4 = fncOnly_m4.foo();

// only used privately no need to emit
import private_m4 = require("private_m4");
export module usePrivate_m4_m1 {
    var x3 = private_m4.x;
    var d3 = private_m4.d;
    var f3 = private_m4.foo();
}

// Do not emit unused import
import m5 = require("m5");
export var d = m5.foo2();

// Do not emit multiple used import statements
import multiImport_m4 = require("m4"); // Emit used
export var useMultiImport_m4_x4 = multiImport_m4.x;
export var useMultiImport_m4_d4 = multiImport_m4.d;
export var useMultiImport_m4_f4 = multiImport_m4.foo();
