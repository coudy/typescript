/// <reference path="fourslash.ts" />

//// /**/declare module Foo {
////     function a(): void {}
//// }
//// 
//// Foo.a();

goTo.marker();
// Bug 672580: Removing 'declare' from module doesn't catch access of non-exported member
// edit.deleteAtCaret('declare '.length);
// verify.numberOfErrorsInCurrentFile(1); // Expected 1: 'a' is not exported

