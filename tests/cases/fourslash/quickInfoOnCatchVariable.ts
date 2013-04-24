/// <reference path="fourslash.ts" />

//// function f() {
////    try { } catch (/**/e) { }
//// }

goTo.marker();
// Bug 673287: 'Invalid declaration' exception thrown getting quick info on 'catch' variable
// verify.quickInfoExists();
