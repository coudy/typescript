/// <reference path='fourslash.ts' />

////class ImplicitConstructor {
////}
////var implicitConstructor = new ImplicitConstructor(/**/);

goTo.marker();
verify.currentSignatureHelpCountIs(1);
verify.currentSignatureHelpReturnTypeIs("ImplicitConstructor");
verify.currentSignatureParamterCountIs(0);
