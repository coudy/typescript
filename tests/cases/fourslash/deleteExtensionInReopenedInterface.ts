/// <reference path="fourslash.ts" />

//// interface A { a: number; }
//// interface B { b: number; }
//// 
//// interface I /*del*/extends A { }
//// interface I extends B { }
//// 
//// var i: I;
//// 

goTo.marker('del');
edit.deleteAtCaret('extends A'.length);

goTo.eof();
// Bug: 679479 Removing the re-extending the interface for a second time keeps the stale members around
// edit.insert("var a = i.a;");
