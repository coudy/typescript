/// <reference path='FourSlash.ts' />

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
verify.not.memberListContains("bar");
verify.not.memberListContains("baz");
