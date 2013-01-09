/// <reference path='fourslash.ts' />

////var f: /*A*/{
////    x: number;
////    <
////};

goTo.marker('A');
verify.quickInfoIs('{ x: number; }');
