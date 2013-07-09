/// <reference path='fourslash.ts' />

////var obj;
////for (var /**/p in obj) { }

goTo.marker();
// BUG 732632
//verify.quickInfoIs('string', "", "p", "var");
verify.quickInfoIs('any', "", "p", "var");