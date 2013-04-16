/// <reference path='FourSlash.ts' />

////class Foo { static fun() { }; }
////
////Foo./**/;
/////*1*/var bar;

goTo.marker();
verify.memberListContains("fun");
verify.not.errorExistsAfterMarker("1");