/// <reference path='fourslash.ts' />

////class ConstructorCall { 
////    constructor(str: string, num: number) {
////    }
////}
////var x = new ConstructorCall(/*constructorCall1*/1,/*constructorCall2*/2);

goTo.marker('constructorCall1');
verify.currentSignatureHelpCountIs(1);
verify.currentSignatureHelpReturnTypeIs("ConstructorCall");
verify.currentParameterHelpArgumentNameIs("str");
verify.currentParameterHelpType("string");
goTo.marker('constructorCall2');
verify.currentParameterHelpArgumentNameIs("num");
verify.currentParameterHelpType("number");
