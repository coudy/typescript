/// <reference path="fourslash.ts" />

//// module A {
////     /**/var o;
//// }
//// enum A {
//// }
//// enum A {
//// }
//// module A {
////     var p;
//// }

goTo.marker();
// Bug 761081
// edit.deleteAtCaret('var o;'.length);

