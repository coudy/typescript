/// <reference path="../fourslash.ts" />

//// 
//// //_modes. // produces an internal error - please implement in derived class
//// 
//// module editor {
////  import modes = _modes;
////  
////  var i : modes.IMode;
////   
////  // If you just use p1:modes, the compiler accepts it - should be an error
////  class Bug {
////      constructor(p1: modes, p2: modes.Mode) {// should be an error on p2 - it's not exported
////      }
////     
////  }
//// }
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(250,116,127,252,125);

////  11:      constructor(p1: modes, p2: modes.Mode) {// should be an error on p2 - it's not exported
////    :  |->-> go here
////  12:      }
////  13:     
goTo.position(326);

////  11:      constructor(p1: modes, p2: modes.Mode) {// should be an error on p2 - it's not exported
////    :  |->-> insert "         var x:modes.Mode;\n"
////  12:      }
////  13:     
//edit.insert("         var x:modes.Mode;\n");
