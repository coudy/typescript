/// <reference path='fourslash.ts' />

////function parameterFunction(callback: (a: number, b: string) => void) {
////    callback(/*parameterFunction1*/5, /*parameterFunction2*/"");
////}

goTo.marker('parameterFunction1');
verify.signatureHelpFunctionNameIs('callback');
verify.signatureHelpCountIs(1);

verify.currentSignatureParamterCountIs(2);
verify.currentSignatureHelpReturnTypeIs("void");

verify.currentParameterHelpArgumentNameIs("a");
verify.currentParameterHelpType("number");
goTo.marker('parameterFunction2');
verify.currentParameterHelpArgumentNameIs("b");
verify.currentParameterHelpType("string");