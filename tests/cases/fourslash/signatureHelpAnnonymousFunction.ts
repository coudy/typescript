/// <reference path='fourslash.ts' />

////var anonymousFunctionTest = function(n: number, s: string): (a: number, b: string) => string {
////    return null;
////}
////anonymousFunctionTest(5, "")(/*anonymousFunction1*/1, /*anonymousFunction2*/"");

goTo.marker('anonymousFunction1');
verify.signatureHelpFunctionNameIs('');
verify.signatureHelpCountIs(1);

verify.currentSignatureParamterCountIs(2);
verify.currentSignatureHelpReturnTypeIs('string');

verify.currentParameterHelpArgumentNameIs("a");
verify.currentParameterHelpType("number");
goTo.marker('anonymousFunction2');
verify.currentParameterHelpArgumentNameIs("b");
verify.currentParameterHelpType("string");