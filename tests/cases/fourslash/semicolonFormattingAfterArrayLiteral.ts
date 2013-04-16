/// <reference path='FourSlash.ts' />

////[1,2]/**/

goTo.marker();
edit.insert(";");

// Adding smicolon should format the innermost statement
verify.currentLineContentIs('[1, 2];');