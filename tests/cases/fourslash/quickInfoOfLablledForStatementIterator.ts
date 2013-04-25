/// <reference path="fourslash.ts" />

//// label1: for(var /**/i = 0; i < 1; i++) { }

goTo.marker();
// Bug 673526: No quick info on iterator variable in labelled for loop statement
verify.quickInfoExists();