/// <reference path='fourslash.ts'/>

////module M {
////    export function C() {}
////    export module C {
////    export var C/**/ = M.C
////  }
////}

goTo.marker();
verify.quickInfoIs('{ C: typeof C; (): void; }');
verify.numberOfErrorsInCurrentFile(0);