/// <reference path='FourSlash.ts' />

////// Simple function test
////function functionCall(str: string, num: number) {
////}
////functionCall(/*functionCall1*/);
////functionCall("", /*functionCall2*/1);


goTo.marker('functionCall1');
verify.currentSignatureHelpCountIs(1);
verify.currentSignatureHelpReturnTypeIs("void");
verify.currentParameterHelpArgumentNameIs("str");
verify.currentParameterHelpType("string");
goTo.marker('functionCall2');
verify.currentParameterHelpArgumentNameIs("num");
verify.currentParameterHelpType("number");

