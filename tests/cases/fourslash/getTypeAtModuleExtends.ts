/// <reference path="fourslash.ts" />

////declare module A.B {
////    export class C { }
////}
////
////import ab = A.B;
////
////class D extends ab.C/**/{ }

goTo.marker();
// Bug 778139: Crash
// diagnostics.validateTypesAtPositions(FourSlash.currentTestState.currentCaretPosition);
