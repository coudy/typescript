/// <reference path='FourSlash.ts' />
//// var x: () =>     string/**/
goTo.marker();
edit.insert(';');
verify.currentLineContentIs("var x: () => string;");
