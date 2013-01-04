/// <reference path="fourslash.ts" />

////class Foo { static bar() { return "x"; } }
////var baz = Foo/**/;
/////*1*/baz.concat("y");

goTo.marker();
edit.insert(".b");
//verify.memberListContains("bar");
verify.errorDoesNotExistBeyondMarker("1");
