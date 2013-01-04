// @target: ES5
// @declaration: true
// @comments: true
/// Module comment
module m1 {
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