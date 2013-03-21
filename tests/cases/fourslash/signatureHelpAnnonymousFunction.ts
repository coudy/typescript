/// <reference path='fourslash.ts' />

////var anonymousFunctionTest = function(n: number, s: string): (a: number, b: string) => string {
////    return null;
////}
////anonymousFunctionTest(5, "")(1/*anonymousFunction*/, "");

goTo.marker('anonymousFunction');
verify.currentSignatureHelpReturnTypeIs("string");
verify.currentParameterHelpArgumentNameIs("a");
verify.currentParameterHelpType("number");
