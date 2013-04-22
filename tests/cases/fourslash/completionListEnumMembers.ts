/// <reference path='fourslash.ts' />

////enum Foo {
////    bar,
////    baz
////}
////
////var v = Foo./*valueReference*/ba;
////var t :Foo./*typeReference*/ba;

goTo.marker('valueReference');
verify.memberListContains("bar");
verify.memberListContains("baz");


goTo.marker('typeReference');
verify.memberListContains("bar");
verify.memberListContains("baz");
