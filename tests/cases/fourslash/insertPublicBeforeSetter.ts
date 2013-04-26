/// <reference path="fourslash.ts" />

//// class C {
////     /**/set Bar(bar:string) {}
//// }
//// var o2 = { set Foo(val:number) { } };

goTo.marker();
// Bug 674761: AST divergence adding 'public' keyword before setter
// edit.insert("public ");
