/// <reference path="fourslash.ts" />

//// class foo {
////     get getterOnly() {
////         return undefined;
////     }
////     set setterOnly() { }
//// }
//// var obj = new foo();
//// obj.setterOnly = obj./**/getterOnly;

goTo.marker();
// Bug 674577: Crash in language service when getting quick info with parameterless setter
verify.quickInfoExists();
