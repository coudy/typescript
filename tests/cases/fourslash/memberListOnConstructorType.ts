/// <reference path='fourslash.ts'/>

////var f: new () => void;
////f./*1*/

goTo.marker('1');
// BUG 746071
//verify.completionListContains('apply');
//verify.completionListContains('arguments');
verify.not.completionListContains('apply');
verify.not.completionListContains('arguments');