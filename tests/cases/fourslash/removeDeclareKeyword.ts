/// <reference path="fourslash.ts" />

//// /**/declare var y;
//// var x = new y;

goTo.marker();
// Bug 778468: Crash in AST converter
// edit.deleteAtCaret('declare'.length);
