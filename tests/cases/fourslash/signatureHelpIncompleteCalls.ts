/// <reference path='fourslash.ts' />

////module IncompleteCalls {
////    class Foo {
////        public f1() { }
////        public f2(n: number): number { return 0; }
////        public f3(n: number, s: string) : string { return ""; }
////    }
////    var x = new Foo();
////    x.f1();
////    x.f2(5);
////    x.f3(5, "");
////    x.f1(/*incompleteCalls1*/
////    x.f2(5,/*incompleteCalls2*/
////    x.f3(5,/*incompleteCalls3*/
////}

goTo.marker('incompleteCalls1');
verify.currentSignatureHelpReturnTypeIs("void");
verify.currentSignatureParamterCountIs(0);
goTo.marker('incompleteCalls2');
verify.currentSignatureParamterCountIs(1);
verify.currentSignatureHelpReturnTypeIs("number");
goTo.marker('incompleteCalls3');
verify.currentSignatureParamterCountIs(2);
verify.currentSignatureHelpReturnTypeIs("string");

//Bug 00000: list offsets are not accurate
//verify.currentParameterHelpArgumentNameIs("s");
//verify.currentParameterHelpType("string");  
verify.currentParameterHelpArgumentNameIs("n");

