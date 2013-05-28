/// <reference path="../fourslash.ts" />

//// interface connectModule {
////     (req, next): void;
//// }
//// interface connectExport {
////     use: (mod: connectModule) => connectExport;
////     listen: (port: number) => void;
//// }
//// var server: {
////     (): connectExport;
////     test1: connectModule;
////     test2(): connectModule;
//// };
//// export = server;
//// export = connectExport;
////  
//// 

edit.disableFormatting();
diagnostics.validateTypesAtPositions(84,107,283,159,198);

//  13: export = server;
//    :  |->-> go here
//  14: export = connectExport;
//  15:  
goTo.position(274);

//  13: export = server;
//    :  |->-> delete "export ..."
//  14: export = connectExport;
//  15:  
edit.deleteAtCaret(24);
diagnostics.validateTypesAtPositions(209,266,181,86,81);

//   1: interface connectModule {
//    :       |->-> go here
//   2:     (req, next): void;
//   3: }
goTo.position(31);

//   1: interface connectModule {
//    :       |->-> insert "res, "
//   2:     (req, next): void;
//   3: }
edit.insert("res, ");
diagnostics.validateTypesAtPositions(30,110,214,134,45);

//  14:  
//    :     |->-> go here
//  15: 
goTo.position(279);

//  14:  
//    :     |->-> insert "export = connectExport;\n"
//  15: 
//edit.insert("export = connectExport;\n");
