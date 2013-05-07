/// <reference path="fourslash.ts" />

////var x/**/ = /aa/;
 
goTo.marker();
debug.printCurrentFileState();
verify.quickInfoIs("RegExp");
