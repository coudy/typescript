declare module 'M' {
   export interface Options { a: number; }
   export class Foo {
        doStuff(x: Options): number;
     }
   export module Foo {
     export var x: number;
     }
}

import M = require('M');
var x/*2*/ = new M./*1*/Foo();
var r2/*5*/ = M./*3*/Foo./*4*/x;
