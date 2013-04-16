/// <reference path='FourSlash.ts' />

////function Foo(arg1: string, arg2: string) {
////}
////
////Foo(/**/

goTo.marker();
verify.currentSignatureHelpReturnTypeIs("void");
verify.currentSignatureParamterCountIs(2);
verify.currentParameterHelpArgumentNameIs("arg1");
verify.currentParameterHelpType("string");  
