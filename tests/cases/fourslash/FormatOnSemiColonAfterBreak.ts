/// <reference path='FourSlash.ts' />

////for (var a in b) {
////break/**/
////}

goTo.marker();
edit.insert(";");
// Adding smicolon should format the break statement
verify.currentLineContentIs('    break;');
