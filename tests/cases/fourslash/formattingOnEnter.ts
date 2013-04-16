/// <reference path='FourSlash.ts' />

////class foo { }
////class bar {/**/ }
////// new line here

goTo.marker();
edit.insertLine("");
verify.currentLineContentIs('class bar {');
