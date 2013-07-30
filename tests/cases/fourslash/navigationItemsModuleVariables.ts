/// <reference path="fourslash.ts"/>


// @Filename: navigationItemsModuleVariables_0.ts
//// /*file1*/
////module Module1 {
////    export var x = 0;
////}

// @Filename: navigationItemsModuleVariables_1.ts
//// /*file2*/
////module Module1.SubModule {
////    export var y = 0;
////}

// @Filename: navigationItemsModuleVariables_2.ts
//// /*file3*/
////module Module1 {
////    export var z = 0;
////}

goTo.marker("file1");
verify.navigationItemsListContains("Module1", "module");
verify.navigationItemsListContains("x", "var");
// nothing else should show up
verify.navigationItemsCount(2); 

goTo.marker("file2");
verify.navigationItemsListContains("Module1", "module");
verify.navigationItemsListContains("SubModule", "module");
verify.navigationItemsListContains("y", "var");
verify.navigationItemsCount(3);
