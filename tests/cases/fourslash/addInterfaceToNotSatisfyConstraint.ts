/// <reference path="fourslash.ts" />

//// interface A {
//// 	a: number;
//// }
//// /**/
//// interface C<T extends A> {
////     x: T;
//// }
//// 
//// var v2: C<B>; // should not work

goTo.marker();

// Bug 673503: Duplicate error when incrementally adding an interface that results in an unsatsified generic constraint
edit.insert("interface B { b: string; }");
