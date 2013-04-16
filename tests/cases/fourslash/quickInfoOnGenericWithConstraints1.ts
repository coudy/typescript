/// <reference path='fourslash.ts'/>

////interface Fo/*1*/o<T/*2*/T extends Date> {}

goTo.marker('1');
verify.quickInfoIs('Foo<TT>', null, 'Foo<TT>')

goTo.marker('2');
verify.quickInfoIs('TT', null, 'TT in Foo<TT>')
