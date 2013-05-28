/// <reference path="../fourslash.ts" />

//// module M {
//// class C1 { }
////     export interface I { n: number; }
//// }
//// module M {
//// function f(): I { return null; } }
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(100,7,17,49,11);

//   1: module M {
//    :  |->-> go here
//   2: class C1 { }
//   3:     export interface I { n: number; }
goTo.position(11);

//   1: module M {
//    :  |->-> insert "    export "
//   2: class C1 { }
//   3:     export interface I { n: number; }
edit.insert("    export ");
diagnostics.validateTypesAtPositions(82,63,60,46,22);

//   2: class C1 { }
//    :             |->-> go here
//   3:     export interface I { n: number; }
//   4: }
goTo.position(35);
//   2: class C1 { }
//    :             |->-> delete "interfa..."
//   3:     export interface I { n: number; }
//   4: }
//edit.deleteAtCaret(11);
