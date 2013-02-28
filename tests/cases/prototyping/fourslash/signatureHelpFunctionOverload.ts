/// <reference path='fourslash.ts' />

////function functionOverload();
////function functionOverload(test: string);
////function functionOverload(test: string) { }
////functionOverload(/*functionOverload1*/)
////functionOverload(""/*functionOverload2*/)

goTo.marker('functionOverload1');
verify.currentSignatureHelpCountIs(2);
verify.currentSignatureHelpReturnTypeIs("any");
verify.currentSignatureParamterCountIs(0);
goTo.marker('functionOverload2');
verify.currentSignatureParamterCountIs(1);
verify.currentParameterHelpArgumentNameIs("test");
verify.currentParameterHelpType("string");
