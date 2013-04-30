/// <reference path="fourslash.ts" />

//// class C {
////     set foo(value) { }
////     /**/
//// }

goTo.marker();
// Bug 681069: Adding duplicate setter doesn't trigger incremental error
// edit.insert("set foo(value) { }");

