// @target: ES5
// @declaration: true
// @comments: true

// @Filename: comments_ExternalModules_0.ts
/// Module comment
export module m1 {
    /// b's comment
    export var b: number;
    /// foo's comment
    function foo() {
        return b;
    }
    /// m2 comments
    export module m2 {
        /// class comment;
        export class c {
        };
        /// i
        export var i = new c();
    }
    /// exported function
    export function fooExport() {
        return foo();
    }
}
m1.fooExport();
var myvar = new m1.m2.c();

// @Filename: comments_ExternalModules_1.ts
///This is on import declaration
import extMod = module("comments_ExternalModules_0");
extMod.m1.fooExport();
var newVar = new extMod.m1.m2.c();