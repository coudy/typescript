/// <reference path="../fourslash.ts" />

//// var a = [];
//// a.concat("hello");
//// 
//// a.concat('Hello');
//// 
//// var b = new Array();
//// b.concat('hello');
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(13,10,48,32,21);

//   1: var a = [];
//    :                  |->-> go here
//   2: a.concat("hello");
//   3: 
goTo.position(28);

//   1: var a = [];
//    :                  |->-> insert ", 'world'"
//   2: a.concat("hello");
//   3: 
edit.insert(", 'world'");
//diagnostics.validateTypesAtPositions(78);
