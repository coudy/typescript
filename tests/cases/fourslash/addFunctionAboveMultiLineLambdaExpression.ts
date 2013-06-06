/// <reference path="fourslash.ts" />

//// /**/
//// () =>
////    // do something
//// 0;

goTo.marker();
// Bug 712225: AST divergence adding function above multi-line lambda expression containing comment
// edit.insert("function Foo() { }");
