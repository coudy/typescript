/// <reference path="fourslash.ts" />

////var x = //**/a/;/*1*/
////x.exec("bab");

goTo.marker();
verify.quickInfoIs("RegExp");
edit.insert("(");
verify.quickInfoIs("RegExp");
verify.errorDoesNotExistAfterMarker("1");