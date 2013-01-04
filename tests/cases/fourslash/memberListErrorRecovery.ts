/// <reference path="fourslash.ts" />

////class Foo { static fun() { }; }
////
////Foo./**/;
/////*1*/var bar;/*2*/

goTo.marker();
verify.memberListContains("fun");
verify.errorDoesNotExistBeyondMarker("1");