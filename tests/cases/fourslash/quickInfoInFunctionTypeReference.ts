/// <reference path='fourslash.ts' />


////function map(fn: (variab/*1*/le1: string) => void) {
////}
////var x = <{ (fn: (va/*2*/riable2: string) => void, a: string): void; }> () => { };

goTo.marker("1");
verify.quickInfoIs("string", undefined, "variable1", "parameter");


goTo.marker("2");
verify.quickInfoIs("string", undefined, "variable2", "parameter");
