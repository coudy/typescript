/// <reference path="fourslash.ts" />

//// class Foo {
////     constructor() { }
////     constructor() { }
////     /**/
//// }

goTo.marker();
var func = 'fn() { }';
// Bug 674594: Duplicate constructor implementation error goes away when adding a function to the class
// edit.insert(func);
verify.numberOfErrorsInCurrentFile(1);
