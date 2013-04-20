/// <reference path='fourslash.ts'/>

////interface Foo<T, U> {
////    x: Foo<T, U>;
////    y: Foo<U, U>;
////}

////var f: Foo<number, string>;
////var xx/*1*/ = f.x;
////var yy/*2*/ = f.y;

////var f2: Foo<string, number>;
////var x2/*3*/ = f2.x;
////var y2/*4*/ = f2.y;

goTo.marker('1');
verify.quickInfoIs('Foo<number, string>');
// BUG 667595
//goTo.marker('2');
//verify.quickInfoIs('Foo<number, number>');

goTo.marker('3');
verify.quickInfoIs('Foo<string, number>');
// BUG 667595
//goTo.marker('4');
//verify.quickInfoIs('Foo<string, string>');