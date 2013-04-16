/// <reference path='FourSlash.ts' />

//// var x: () =>           string/**/

goTo.marker();
edit.insert(';');

// formatting on function return type
verify.currentLineContentIs('var x: () => string;');
