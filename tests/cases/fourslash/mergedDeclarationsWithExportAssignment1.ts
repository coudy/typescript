/// <reference path='fourslash.ts'/>

// @Filename: mergedDeclarationsWithExportAssignment1_file0.ts
////declare module 'M' 
////{
////    class Foo {
////        doStuff(x: number): number;
////    }
////    module Foo {
////        export var x: number;
////    }
////    export = Foo;
////}

// @Filename: mergedDeclarationsWithExportAssignment1_file1.ts
///////<reference path='mergedDeclarationsWithExportAssignment1_file0.ts'/>
////import Foo/*1*/ = require('M');
////var z/*3*/ = new /*2*/Foo();
////var r2/*5*/ = Foo./*4*/x;

goTo.marker('1');
verify.quickInfoIs('{ x: number; new(): Foo; }');

goTo.marker('2');
verify.completionListContains('Foo');

goTo.marker('3');
verify.quickInfoIs('Foo');

goTo.marker('4');
verify.completionListContains('x');

goTo.marker('5');
verify.quickInfoIs('number');

