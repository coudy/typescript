/// <reference path="fourslash.ts" />

//// /**/interface A { a: string; }
//// interface G<T, U> { }
//// var v1: G<A, C>;

goTo.marker();
// Bug 674688: Unresolved symbol error in generic type argument position doesn't appear when incrementally triggered
// edit.deleteAtCaret('interface A { a: string; }'.length);
