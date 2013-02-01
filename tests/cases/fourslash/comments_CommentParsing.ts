/// <reference path='fourslash.ts' />

/////// This is simple /// comments
////function simple() {
////}
////
////simple( /*1*/);
////
/////// multiLine /// Comments
/////// This is example of multiline /// comments
/////// Another multiLine
////function multiLine() {
////}
////multiLine( /*2*/);
////
/////** this is eg of single line jsdoc style comment */
////function jsDocSingleLine() {
////}
////jsDocSingleLine(/*3*/);
////
////
/////** this is multiple line jsdoc stule comment
////*New line1
////*New Line2*/
////function jsDocMultiLine() {
////}
////jsDocMultiLine(/*4*/);
////
/////** this is multiple line jsdoc stule comment
////*New line1
////*New Line2*/
/////** Shoul mege this line as well
////* and this too*/ /** Another this one too*/
////function jsDocMultiLineMerge() {
////}
////jsDocMultiLineMerge(/*5*/);
////
////
/////// Triple slash comment
/////** jsdoc comment */
////function jsDocMixedComments1() {
////}
////jsDocMixedComments1(/*6*/);
////
/////// Triple slash comment
/////** jsdoc comment */ /*** another jsDocComment*/
////function jsDocMixedComments2() {
////}
////jsDocMixedComments2(/*7*/);
////
/////** jsdoc comment */ /*** another jsDocComment*/
/////// Triple slash comment
////function jsDocMixedComments3() {
////}
////jsDocMixedComments3(/*8*/);
////
/////** jsdoc comment */ /*** another jsDocComment*/
/////// Triple slash comment
/////// Triple slash comment 2
////function jsDocMixedComments4() {
////}
////jsDocMixedComments4(/*9*/);
////
/////// Triple slash comment 1
/////** jsdoc comment */ /*** another jsDocComment*/
/////// Triple slash comment
/////// Triple slash comment 2
////function jsDocMixedComments5() {
////}
////jsDocMixedComments5(/*10*/);
////
/////*** another jsDocComment*/
/////// Triple slash comment 1
/////// Triple slash comment
/////// Triple slash comment 2
/////** jsdoc comment */
////function jsDocMixedComments6() {
////}
////jsDocMixedComments6(/*11*/);
////
////// This shoulnot be help comment
////function noHelpComment1() {
////}
////noHelpComment1(/*12*/);
////
/////* This shoulnot be help comment */
////function noHelpComment2() {
////}
////noHelpComment2(/*13*/);
////
////function noHelpComment3() {
////}
////noHelpComment3(/*14*/);
/////** Adds two integers and returns the result
////  * @param {number} a first number
////  * @param b second number
////  */
////function sum(a: number, b: number) {
////    return /*18*/a + b;
////}
/////*15*/sum(/*16*/10, /*17*/20);
/////** This is multiplication function*/
/////** @param */
/////** @param a first number*/
/////** @param b */
/////** @param c {
//// @param d @anotherTag*/
/////** @param e LastParam @anotherTag*/
////function multiply(a: number, b: number, c?: number, d?, e?) {
////}
////multiply(/*19*/10,/*20*/ 20,/*21*/ 30, /*22*/40, /*23*/50);
/////** fn f1 with number
////* @param { string} b about b
////*/
////function f1(a: number);
////function f1(b: string);
/////**@param opt optional parameter*/
////function f1(aOrb, opt?) {
////    return /*24*/aOrb;
////}
////f1(/*25*/10);
////f1(/*26*/"hello");
/////*27*/
/////** This is subtract function
////@param { a
////*@param { number | } b this is about b
////@param { { () => string; } } c this is optional param c
////@param { { () => string; } d this is optional param d
////@param { { () => string; } } e this is optional param e
////@param { { { () => string; } } f this is optional param f
////*/
////function subtract(a: number, b: number, c?: () => string, d?: () => string, e?: () => string, f?: () => string) {
////}
////subtract(/*28*/10, /*29*/ 20, /*30*/ null, /*31*/ null, /*32*/ null, /*33*/null);
/////** this is square function
////@paramTag { number } a this is input number of paramTag
////@param { number } a this is input number
////@returnType { number } it is return type
////*/
////function square(a: number) {
////    return a * a;
////}
////square(/*34*/10);
/////** this is divide function
////@param { number} a this is a
////@paramTag { number } g this is optional param g
////@param { number} b this is b
////*/
////function divide(a: number, b: number) {
////}
////divide(/*35*/10, /*36*/20);
/////**
////Function returns string concat of foo and bar
////@param			{string}		foo		is string
////@param		    {string}		bar		is second string
////*/
////function fooBar(foo: string, bar: string) {
////    return foo + bar;
////}
////fooBar(/*37*/"foo",/*38*/"bar");
/////** This is a comment */
////var x;
/////** 
////  * This is a comment 
////  */
////var y;
/////** this is jsdoc style function with param tag as well as inline parameter help
////*@param a it is first parameter
////*@param c it is third parameter
////*/
////function jsDocParamTest(/** this is inline comment for a */a: number, /** this is inline comment for b*/ b: number, c: number, d: number) {
////    return /*39*/a + b + c + d;
////}
/////*44*/jsDocParamTest(/*40*/30, /*41*/40, /*42*/50, /*43*/60);
/////** This is function comment
////  * And properly aligned comment 
////  */
////function jsDocCommentAlignmentTest1() {
////}
////jsDocCommentAlignmentTest1(/*45*/);
/////** This is function comment
////  *     And aligned with 4 space char margin
////  */
////function jsDocCommentAlignmentTest2() {
////}
////jsDocCommentAlignmentTest2(/*46*/);
/////** This is function comment
////  *     And aligned with 4 space char margin
////  * @param {string} a this is info about a
////  *                   spanning on two lines and aligned perfectly
////  * @param b          this is info about b
////  *                   spanning on two lines and aligned perfectly
////  *                   spanning one more line alined perfectly
////  *                       spanning another line with more margin
////  * @param c          this is info about b
////  *  not aligned text about parameter will eat only one space
////  */
////function jsDocCommentAlignmentTest3(a: string, b, c) {
////}
////jsDocCommentAlignmentTest3(/*47*/"hello",/*48*/1, /*49*/2);
/////**/
////class NoQuic/*50*/kInfoClass {
////}


goTo.marker('1');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('2');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('3');
verify.currentSignatureHelpDocCommentIs("this is eg of single line jsdoc style comment ");

goTo.marker('4');
verify.currentSignatureHelpDocCommentIs("this is multiple line jsdoc stule comment\nNew line1\nNew Line2");

goTo.marker('5');
verify.currentSignatureHelpDocCommentIs("this is multiple line jsdoc stule comment\nNew line1\nNew Line2\nShoul mege this line as well\nand this too\nAnother this one too");

goTo.marker('6');
verify.currentSignatureHelpDocCommentIs("jsdoc comment ");

goTo.marker('7');
verify.currentSignatureHelpDocCommentIs("jsdoc comment \nanother jsDocComment");

goTo.marker('8');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('9');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('10');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('11');
verify.currentSignatureHelpDocCommentIs("jsdoc comment ");

goTo.marker('12');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('13');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('14');
verify.currentSignatureHelpDocCommentIs("");

goTo.marker('15');
verify.completionListContains("sum", "(a: number, b: number) => number", "Adds two integers and returns the result", "sum", "function");

goTo.marker('16');
verify.currentSignatureHelpDocCommentIs("Adds two integers and returns the result");
verify.currentParameterHelpArgumentDocCommentIs("first number");

goTo.marker('17');
verify.currentSignatureHelpDocCommentIs("Adds two integers and returns the result");
verify.currentParameterHelpArgumentDocCommentIs("second number");

goTo.marker('18');
verify.completionListContains("a", "number", "first number", "a", "(parameter)");
verify.completionListContains("b", "number", "second number", "b", "(parameter)");

goTo.marker('19');
verify.currentSignatureHelpDocCommentIs("This is multiplication function\n@anotherTag\n@anotherTag");
verify.currentParameterHelpArgumentDocCommentIs("first number");

goTo.marker('20');
verify.currentSignatureHelpDocCommentIs("This is multiplication function\n@anotherTag\n@anotherTag");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('21');
verify.currentSignatureHelpDocCommentIs("This is multiplication function\n@anotherTag\n@anotherTag");
verify.currentParameterHelpArgumentDocCommentIs("{");

goTo.marker('22');
verify.currentSignatureHelpDocCommentIs("This is multiplication function\n@anotherTag\n@anotherTag");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('23');
verify.currentSignatureHelpDocCommentIs("This is multiplication function\n@anotherTag\n@anotherTag");
verify.currentParameterHelpArgumentDocCommentIs("LastParam ");

goTo.marker('24');
verify.completionListContains("aOrb", "any", "", "aOrb", "(parameter)");
verify.completionListContains("opt", "any", "optional parameter", "opt", "(parameter)");

goTo.marker('25');
verify.currentSignatureHelpDocCommentIs("fn f1 with number");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('26');
verify.currentSignatureHelpDocCommentIs("");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('27');
verify.completionListContains("multiply", "(a: number, b: number, c?: number, d?: any, e?: any) => void", "This is multiplication function\n@anotherTag\n@anotherTag", "multiply", "function");
verify.completionListContains("f1", "(a: number) => any (+ 1 overload(s))", "fn f1 with number", "f1", "function");

goTo.marker('28');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('29');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("this is about b");

goTo.marker('30');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("this is optional param c");

goTo.marker('31');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('32');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("this is optional param e");

goTo.marker('33');
verify.currentSignatureHelpDocCommentIs("This is subtract function");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('34');
verify.currentSignatureHelpDocCommentIs("this is square function\n@paramTag { number } a this is input number of paramTag\n@returnType { number } it is return type");
verify.currentParameterHelpArgumentDocCommentIs("this is input number");

goTo.marker('35');
verify.currentSignatureHelpDocCommentIs("this is divide function\n@paramTag { number } g this is optional param g");
verify.currentParameterHelpArgumentDocCommentIs("this is a");

goTo.marker('36');
verify.currentSignatureHelpDocCommentIs("this is divide function\n@paramTag { number } g this is optional param g");
verify.currentParameterHelpArgumentDocCommentIs("this is b");

goTo.marker('37');
verify.currentSignatureHelpDocCommentIs("Function returns string concat of foo and bar");
verify.currentParameterHelpArgumentDocCommentIs("is string");

goTo.marker('38');
verify.currentSignatureHelpDocCommentIs("Function returns string concat of foo and bar");
verify.currentParameterHelpArgumentDocCommentIs("is second string");

goTo.marker('39');
verify.completionListContains("a", "number", "it is first parameter\nthis is inline comment for a ", "a", "(parameter)");
verify.completionListContains("b", "number", "this is inline comment for b", "b", "(parameter)");
verify.completionListContains("c", "number", "it is third parameter", "c", "(parameter)");
verify.completionListContains("d", "number", "", "d", "(parameter)");

goTo.marker('40');
verify.currentSignatureHelpDocCommentIs("this is jsdoc style function with param tag as well as inline parameter help");
verify.currentParameterHelpArgumentDocCommentIs("it is first parameter\nthis is inline comment for a ");

goTo.marker('41');
verify.currentSignatureHelpDocCommentIs("this is jsdoc style function with param tag as well as inline parameter help");
verify.currentParameterHelpArgumentDocCommentIs("this is inline comment for b");

goTo.marker('42');
verify.currentSignatureHelpDocCommentIs("this is jsdoc style function with param tag as well as inline parameter help");
verify.currentParameterHelpArgumentDocCommentIs("it is third parameter");

goTo.marker('43');
verify.currentSignatureHelpDocCommentIs("this is jsdoc style function with param tag as well as inline parameter help");
verify.currentParameterHelpArgumentDocCommentIs("");

goTo.marker('44');
verify.completionListContains("jsDocParamTest", "(a: number, b: number, c: number, d: number) => number", "this is jsdoc style function with param tag as well as inline parameter help", "jsDocParamTest", "function");
verify.completionListContains("x", "any", "This is a comment ", "x", "var");
verify.completionListContains("y", "any", "This is a comment ", "y", "var");

goTo.marker('45');
verify.currentSignatureHelpDocCommentIs("This is function comment\nAnd properly aligned comment ");

goTo.marker('46');
verify.currentSignatureHelpDocCommentIs("This is function comment\n    And aligned with 4 space char margin");

goTo.marker('47');
verify.currentSignatureHelpDocCommentIs("This is function comment\n    And aligned with 4 space char margin");
verify.currentParameterHelpArgumentDocCommentIs("this is info about a\nspanning on two lines and aligned perfectly");

goTo.marker('48');
verify.currentSignatureHelpDocCommentIs("This is function comment\n    And aligned with 4 space char margin");
verify.currentParameterHelpArgumentDocCommentIs("this is info about b\nspanning on two lines and aligned perfectly\nspanning one more line alined perfectly\n    spanning another line with more margin");

goTo.marker('49');
verify.currentSignatureHelpDocCommentIs("This is function comment\n    And aligned with 4 space char margin");
verify.currentParameterHelpArgumentDocCommentIs("this is info about b\nnot aligned text about parameter will eat only one space");

goTo.marker('50');
verify.quickInfoIs("new() => NoQuickInfoClass");