/// <reference path='fourslash.ts' />

////function Foo(arg1: string, arg2: string) {
////}
////
////Foo(/**/

goTo.marker();
verify.signatureHelpPresent();
verify.signatureHelpCountIs(1);
verify.signatureHelpFunctionNameIs('Foo');

verify.currentSignatureHelpReturnTypeIs("void");
verify.currentSignatureParamterCountIs(2);
verify.currentParameterHelpArgumentNameIs("arg1");
verify.currentParameterHelpType("string");