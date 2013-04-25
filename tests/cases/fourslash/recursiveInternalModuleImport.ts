/// <reference path="fourslash.ts" />

//// module M {
////     import A = B;
////     import /**/B = A;
//// }
//// 

goTo.marker();
// Bug 673496: Stack overflow when trying to get quick info on recursive internal module import
verify.quickInfoExists();

