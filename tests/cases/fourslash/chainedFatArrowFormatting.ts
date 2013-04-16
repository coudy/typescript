/// <reference path='FourSlash.ts' />

//// var fn = () => () => null/**/

goTo.marker();
edit.insert(';');

// spacing around arrow in chained fat arrow syntax
verify.currentLineContentIs('var fn = () => () => null;');
