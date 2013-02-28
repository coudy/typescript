/// <reference path='fourslash.ts' />

////class ConstructorOverload { 
////    constructor();
////    constructor(test: string);
////    constructor(test?: string) {
////    }
////}
////var x = new ConstructorOverload(/*constructorOverload1*/);
////var x = new ConstructorOverload(""/*constructorOverload2*/);


goTo.marker('constructorOverload1');
verify.currentSignatureHelpCountIs(2);
verify.currentSignatureHelpReturnTypeIs("ConstructorOverload");
verify.currentSignatureParamterCountIs(0);
goTo.marker('constructorOverload2');
verify.currentSignatureParamterCountIs(1);
verify.currentParameterHelpArgumentNameIs("test");
verify.currentParameterHelpType("string");