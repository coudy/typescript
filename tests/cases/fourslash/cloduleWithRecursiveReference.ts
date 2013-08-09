/// <reference path='fourslash.ts'/>

////module M {
////    export class C {
////        foo() { }
////    }
////    export module C {
////    export var C/**/ = M.C
////  }
////}

goTo.marker();
verify.quickInfoIs('{ C: typeof C; new(): C; }');
verify.numberOfErrorsInCurrentFile(0);