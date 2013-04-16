/// <reference path='fourslash.ts' />

////class SuperOverloadlBase {
////    constructor();
////    constructor(test: string);
////    constructor(test?: string) {
////    }
////}
////class SuperOverLoad1 extends SuperOverloadlBase {
////    constructor() {
////        super(/*superOverload1*/);
////    }
////}
////class SuperOverLoad2 extends SuperOverloadlBase {
////    constructor() {
////        super(""/*superOverload2*/);
////    }
////}

goTo.marker('superOverload1');
verify.currentSignatureHelpCountIs(2);
verify.currentSignatureHelpReturnTypeIs("SuperOverloadlBase");
verify.currentSignatureParamterCountIs(0);
goTo.marker('superOverload2');
verify.currentSignatureParamterCountIs(1);
verify.currentParameterHelpArgumentNameIs("test");
verify.currentParameterHelpType("string");