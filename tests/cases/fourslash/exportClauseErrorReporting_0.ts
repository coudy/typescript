/// <reference path="../fourslash.ts" />

//// module M {
//// 
//// }
////  
//// var x = new M.C<string>();
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(24,40,20,0,30);

//   1: 
//    : |->-> go here
//   2: 
//   3: }
goTo.position(11);

//   1: 
//    : |->-> insert "\nexport class C<T> { }\n"
//   2: 
//   3: }
edit.insert("\nexport class C<T> { }\n");
diagnostics.validateTypesAtPositions(52,53,26,43,54);

//   1: 
//    : |->-> go here
//   2: 
//   3: }
goTo.position(11);

//   1: 
//    : |->-> delete "\n}\n \..."
//   2: 
//   3: }
//edit.deleteAtCaret(8);
