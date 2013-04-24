/// <reference path='fourslash.ts'/>

////class clsOverload { constructor(); constructor(test: string); constructor(test?: string) { } }
////var x = new clsOverload(/*1*/);
////var y = new clsOverload(/*2*/'');

goTo.marker('1');
verify.signatureHelpFunctionNameIs('clsOverload');
verify.signatureHelpCountIs(2);

verify.currentSignatureParamterCountIs(0);
verify.currentSignatureHelpReturnTypeIs('clsOverload');

goTo.marker('2');
verify.currentSignatureParamterCountIs(1);
verify.currentSignatureHelpReturnTypeIs('clsOverload');
verify.currentParameterHelpArgumentNameIs('test');
verify.currentParameterHelpType('string');