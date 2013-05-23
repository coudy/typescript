/// <reference path="../fourslash.ts" />

//// // @Filename: exportEqualsInterface_A.ts
//// interface A {
//// 	p1: number;
//// }
//// 
//// export = A;
//// 
//// var i: I1;
//// 
//// var n: number = i.p1;

edit.disableFormatting();
diagnostics.validateTypesAtPositions(60,101,41,80,51);

//   6: 
//    : |->-> go here
//   7: 
//   8: var i: I1;
goTo.position(83);

//   6: 
//    : |->-> insert "\n// @Filename: exportEqual..."
//   7: 
//   8: var i: I1;
//edit.insert("\nimport I1 = module(\"exportEqualsInterface_A\");\n");
