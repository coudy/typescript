/// <reference path='FourSlash.ts' />

/////**/
////class Foo {
////}

////var f/*A*/ff = new Foo();

goTo.marker('A');
verify.quickInfoIs('Foo');
