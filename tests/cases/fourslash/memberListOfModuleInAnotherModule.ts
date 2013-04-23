/// <reference path='fourslash.ts'/>

////module mod1 {
////    var mX = 1;
////    function mFunc() { }
////    class mClass { }
////    module mMod { }
////    interface mInt {}
////    export var meX = 1;
////    export function meFunc() { }
////    export class meClass { }
////    export module meMod { export var iMex = 1; }
////    export interface meInt {}
////}
////
////module frmConfirm {
////    import Mod1 = mod1;
////    import iMod1 = mod1./*1*/meMod;
////    Mod1./*2*/meX = 1;
////    iMod1./*3*/iMex = 1;
////}

goTo.marker('1');
// bug 667635: The completion list of module's exported members is not complete
//verify.completionListContains('meX', 'number');
//verify.completionListContains('meFunc', '(): void');
verify.completionListContains('meClass', 'mod1.meClass');
verify.completionListContains('meMod', 'mod1.meMod');
verify.completionListContains('meInt', 'mod1.meInt');

goTo.marker('2');
// bug 667635: The completion list of module's exported members is not complete
verify.completionListContains('meX', 'number');
verify.completionListContains('meFunc', '(): void');
//verify.completionListContains('meClass', 'mod1.meClass');
verify.completionListContains('meMod', 'mod1.meMod');
//verify.completionListContains('meInt', 'mod1.meInt');

goTo.marker('3');
verify.completionListContains('iMex', 'number');