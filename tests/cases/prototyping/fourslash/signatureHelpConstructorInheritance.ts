/// <reference path='fourslash.ts' />

////class base {
////    constructor(s: string);
////    constructor(n: number);
////    constructor(a: any) { }
////}
////class B1 extends base { }
////class B2 extends B1 { }
////class B3 extends B2 {
////    constructor() {
////        super(3/*indirectSuperCall*/);
////    }
////}


goTo.marker('indirectSuperCall');

//Bug 00000: constructorInheritiance not working
//verify.currentSignatureHelpCountIs(2);
//verify.currentSignatureHelpReturnTypeIs("B2");
//verify.currentSignatureParamterCountIs(1);
//verify.currentParameterHelpArgumentNameIs("n");
//verify.currentParameterHelpType("number");

verify.currentSignatureHelpCountIs(1);