/// <reference path='FourSlash.ts' />

////class A {
////    foo(nu/**/: number) {
////    }
////}

goTo.marker();
// 17383: Completion list shouldn't be present in argument name position
verify.not.completionListContains('number');
