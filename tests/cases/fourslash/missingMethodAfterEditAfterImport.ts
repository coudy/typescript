/// <reference path='fourslash.ts' />

//// module foo {
////     export module bar { module baz { export class boo { } } }
//// }
//// 
//// import f = /*foo*/foo;
//// 
//// /*delete*/var x;

// !!!! This file used to require the edits seen at the bottom to trigger the error, but no longer do.
// When the bug is fixed, the whole test should be uncommented to ensure the bug is fully fixed.

// Bug 672433: Retyper: Object has no method 'isError' after deleting line in file with import of internal module with nested structure inside of it

// Sanity check
goTo.marker('foo');
verify.quickInfoSymbolNameIs('foo');

// Delete some code
goTo.marker('delete');
edit.deleteAtCaret('var x;'.length);

// Pull on the RHS of an import
goTo.marker('foo');
verify.quickInfoSymbolNameIs('foo');
