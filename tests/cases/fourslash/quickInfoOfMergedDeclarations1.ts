/// <reference path='fourslash.ts' />

////class foo { /*3*/constructor(y: number) { } }
////module foo {
////   export var x = 1;
////}
////var /*1*/aa = {
////   /*2*/artist: foo
////}

goTo.marker('1');
verify.quickInfoIs("{ artist: { x: number; new(y: number): foo; }; }", undefined, "aa", "var");

goTo.marker('2');
verify.quickInfoIs("{ x: number; new(y: number): foo; }", undefined, "artist", "property");

goTo.marker('3');
verify.quickInfoIs("(y: number): foo", undefined, "foo", "constructor");
