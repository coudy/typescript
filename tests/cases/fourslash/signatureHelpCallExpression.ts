/// <reference path='fourslash.ts'/>

////function fnTest(str: string, num: number) { }
////fnTest(/*1*/'', /*2*/5);

goTo.marker('1');
verify.signatureHelpFunctionNameIs('fnTest');
verify.signatureHelpCountIs(1);

verify.currentSignatureParamterCountIs(2);
verify.currentSignatureHelpReturnTypeIs('void');

verify.currentParameterHelpArgumentNameIs('str');
verify.currentParameterHelpType('string');
goTo.marker('2');
verify.currentParameterHelpArgumentNameIs('num');
verify.currentParameterHelpType('number');