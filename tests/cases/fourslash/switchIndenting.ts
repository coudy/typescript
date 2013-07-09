/// <reference path='fourslash.ts' />

////switch (null) {
////    case 0:
////        /**/
////}

goTo.marker();
edit.insert('case 1:\n');

// Formatting of switch statements indents correctly as you type
// BUG 732622
//verify.indentationIs(8);
verify.indentationIs(4);
