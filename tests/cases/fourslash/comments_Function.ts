/// <reference path='fourslash.ts' />

/////** This comment should appear for foo*/
////function f/*6*/oo() {
////}
////f/*7*/oo/*4*/(/*1*/);
/////** This is comment for function signature*/
////function fo/*8*/oWithParameters(/** this is comment about a*/a: string,
////    /** this is comment for b*/
////    b: number) {
////    var d = /*10*/a;
////}
////fooWithParam/*9*/eters/*5*/(/*2*/"a",/*3*/10);
/////** lamdaFoo var comment*/
////var lamb/*11*/daFoo = /** this is lambda comment*/ (/**param a*/a: number, /**param b*/b: number) => /*18*/a + b;
////var lambddaN/*12*/oVarComment = /** this is lambda multiplication*/ (/**param a*/a: number, /**param b*/b: number) => a * b;
/////*13*/lambdaFoo(/*14*/10, /*15*/20);
////lambddaNoVarComment(/*16*/10, /*17*/20);
/////**
////* Does something
////* @param a a string
////*/
////declare function fn(a: string);
////fn(/*19*/"hello");

goTo.marker('1');
verify.currentSignatureHelpDocCommentIs("This comment should appear for foo");

goTo.marker('2');
verify.currentSignatureHelpDocCommentIs("This is comment for function signature");
verify.currentParameterHelpArgumentDocCommentIs("this is comment about a");

goTo.marker('3');
verify.currentSignatureHelpDocCommentIs("This is comment for function signature");
verify.currentParameterHelpArgumentDocCommentIs("this is comment for b");

goTo.marker('4');
verify.completionListContains('foo', '() => void', 'This comment should appear for foo', "function");

goTo.marker('5');
verify.completionListContains('fooWithParameters', '(a: string, b: number) => void', 'This is comment for function signature', "function");

goTo.marker('6');
verify.quickInfoIs("() => void");

goTo.marker('7');
verify.quickInfoIs("() => void");

goTo.marker('8');
verify.quickInfoIs("(a: string, b: number) => void");

goTo.marker('9');
verify.quickInfoIs("(a: string, b: number) => void");

goTo.marker('10');
verify.completionListContains('a', 'string', 'this is comment about a', "(parameter)");
verify.completionListContains('b', 'number', 'this is comment for b', "(parameter)");

goTo.marker('11');
verify.quickInfoIs("(a: number, b: number) => number");

goTo.marker('12');
verify.quickInfoIs("(a: number, b: number) => number");

goTo.marker('13');
verify.completionListContains('lambdaFoo', '(a: number, b: number) => number', 'lamdaFoo var comment', "var");
verify.completionListContains('lambddaNoVarComment', '(a: number, b: number) => number', '', "var");

goTo.marker('14');
verify.currentSignatureHelpDocCommentIs("this is lambda comment");
verify.currentParameterHelpArgumentDocCommentIs("param a");

goTo.marker('15');
verify.currentSignatureHelpDocCommentIs("this is lambda comment");
verify.currentParameterHelpArgumentDocCommentIs("param b");

goTo.marker('16');
verify.currentSignatureHelpDocCommentIs("this is lambda multiplication");
verify.currentParameterHelpArgumentDocCommentIs("param a");

goTo.marker('17');
verify.currentSignatureHelpDocCommentIs("this is lambda multiplication");
verify.currentParameterHelpArgumentDocCommentIs("param b");

goTo.marker('18');
verify.completionListContains('a', 'number', 'param a', "(parameter)");
verify.completionListContains('b', 'number', 'param b', "(parameter)");

goTo.marker('19');
verify.currentSignatureHelpDocCommentIs("Does something");
verify.currentParameterHelpArgumentDocCommentIs("a string");