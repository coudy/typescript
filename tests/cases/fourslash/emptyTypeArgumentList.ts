/// <reference path="fourslash.ts" />

//// function foo2<T>(test);
//// function foo2<T>() { }
//// /**/foo2<>("");

goTo.marker();
// Bug 805241: Assert here
// diagnostics.validateTypeAtCurrentPosition();
