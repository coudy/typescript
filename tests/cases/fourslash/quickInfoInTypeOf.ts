/// <reference path='fourslash.ts'/>

////module m1c {
////    export interface I { foo(): void; }
////}
////var x: typeof m1c./*1*/;

goTo.marker('1');
verify.completionListContains('I');
verify.not.completionListContains('foo');
