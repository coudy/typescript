/// <reference path='FourSlash.ts' />

////class SuperCallBase {
////    constructor(b: boolean) {
////    }
////}
////class SuperCall extends SuperCallBase {
////    constructor() {
////        super(/*superCall*/);
////    }
////}

goTo.marker('superCall');
verify.currentSignatureHelpCountIs(1);
verify.currentSignatureHelpReturnTypeIs("SuperCallBase");
verify.currentParameterHelpArgumentNameIs("b");
verify.currentParameterHelpType("boolean");
