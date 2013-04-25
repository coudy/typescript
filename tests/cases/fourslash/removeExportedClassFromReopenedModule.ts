/// <reference path="fourslash.ts" />

//// module multiM { }
//// 
//// module multiM {
////     /*1*/export class c { }
//// }
//// 

goTo.marker('1');
edit.deleteAtCaret('export class c { }'.length);

goTo.eof();
// Bug 674557: Removing exported class from reopened internal module doesn't always flag consumption sites as errors
// edit.insert("new multiM.c();");
// verify.numberOfErrorsInCurrentFile(1);
