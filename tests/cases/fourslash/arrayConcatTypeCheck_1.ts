/// <reference path="../fourslash.ts" />

//// a.concat("hello", 'world');
//// 
//// a.concat('Hello');
//// 
//// var b = new Array<>();
//// b.concat('hello');
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(16,2,89,67,55);

//    :                  |->-> go here
//   1: a.concat("hello", 'world');
//   2: 
goTo.position(16);

//    :                  |->-> delete ", 'world'"
//   1: a.concat("hello", 'world');
//   2: 
edit.deleteAtCaret(9);
diagnostics.validateTypesAtPositions(36,80,72,2,8);

//   2: 
//    :  |->-> go here
//   3: a.concat('Hello');
//   4: 
goTo.position(29);

//   2: 
//    :  |->-> delete "a.conca"
//   3: a.concat('Hello');
//   4: 
edit.deleteAtCaret(7);
diagnostics.validateTypesAtPositions(73,28,17,9,29);

//    :           |->-> go here
//   1: a.concat("hello");
//   2: 
goTo.position(9);

//    :           |->-> delete "\"hello\""
//   1: a.concat("hello");
//   2: 
edit.deleteAtCaret(7);
//diagnostics.validateTypesAtPositions(43);