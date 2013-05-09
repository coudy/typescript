/// <reference path="fourslash.ts" />

//// /**/declare module Foo {
////     function a(): void {}
//// }
//// 
//// Foo.a();

goTo.marker();
edit.deleteAtCaret('declare '.length);
verify.numberOfErrorsInCurrentFile(1); // Expected 1: 'a' is not exported

