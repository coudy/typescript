/// <reference path='fourslash.ts' />

////var foo = '';
////( // f/**/

goTo.marker();
// Completion list should not be available within comments
verify.not.completionListContains('foo');
