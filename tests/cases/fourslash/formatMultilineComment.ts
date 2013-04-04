/// <reference path='fourslash.ts' />

/////*1*//** hello
//// */*2*/
/////*3*/ */
format.document();
goTo.marker('1');
verify.currentLineContentIs("/** hello");
goTo.marker('2');
verify.currentLineContentIs("*");
goTo.marker('3');
verify.currentLineContentIs("*/");