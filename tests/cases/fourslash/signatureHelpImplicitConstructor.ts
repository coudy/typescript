/// <reference path='fourslash.ts' />

////class ImplicitConstructor {
////}
////var implicitConstructor = new ImplicitConstructor(/**/);

goTo.marker();
verify.signatureHelpCountIs(1);
verify.currentSignatureHelpReturnTypeIs("ImplicitConstructor");
verify.currentSignatureParamterCountIs(0);
