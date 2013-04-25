/// <reference path="fourslash.ts" />

//// function fn(/* comment! */ /**/a: number, c) { }

goTo.marker();

// Bug 674582: Removing parameter between comment and other parameter causes incremental AST divergence
// edit.deleteAtCaret('a: number,'.length);
