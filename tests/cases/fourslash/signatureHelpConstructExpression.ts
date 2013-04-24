/// <reference path='fourslash.ts'/>

////class sampleCls { constructor(str: string, num: number) { } }
////var x = new sampleCls(/*1*/"", /*2*/5);

goTo.marker('1');
verify.signatureHelpCountIs(1);
verify.signatureHelpFunctionNameIs('sampleCls');

verify.currentSignatureParamterCountIs(2);
verify.currentSignatureHelpReturnTypeIs('sampleCls');

verify.currentParameterHelpArgumentNameIs('str');
verify.currentParameterHelpType('string');
goTo.marker('2');
verify.currentParameterHelpArgumentNameIs('num');
verify.currentParameterHelpType('number');