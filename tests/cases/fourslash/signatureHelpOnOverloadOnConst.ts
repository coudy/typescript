/// <reference path='fourslash.ts'/>

////function x1(x: 'hi');
////function x1(y: 'bye');
////function x1(z: string);
////function x1(a: any) {
////}

////x1(''/**/);

goTo.marker();
verify.signatureHelpCountIs(3);
verify.currentParameterHelpType("string");