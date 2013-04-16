/// <reference path='FourSlash.ts' />


////function foo(n: number): string {
////}
////
////foo(/**/

goTo.marker();
verify.currentSignatureHelpReturnTypeIs("string");
verify.currentParameterHelpArgumentNameIs("n");
verify.currentParameterHelpType("number");
