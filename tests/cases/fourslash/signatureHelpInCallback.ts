/// <reference path='FourSlash.ts' />

////declare function forEach(f: () => void);
////forEach(/*1*/() => {
////    /*2*/
////});

goTo.marker('1');
verify.signatureHelpPresent();
goTo.marker('2');
verify.not.signatureHelpPresent();
