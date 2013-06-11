/// <reference path="fourslash.ts"/>


//// /*file1*/
////module Module1 {
////    export var x = 0;
////}

//// /*file2*/
////module Module1.SubModule {
////    export var y = 0;
////}

//// /*file3*/
////module Module1 {
////    export var z = 0;
////}

//goTo.marker("file1");
//verify.navigationItemsListContains("Module1", "module");
//verify.navigationItemsListContains("x", "var");
//// should pick up values from another module instance
//verify.navigationItemsListContains("z", "var");
//// nothing else should show up
//verify.navigationItemsCount(3); 


//goTo.marker("file2");
//verify.navigationItemsListContains("Module1", "module");
//verify.navigationItemsListContains("SubModule", "module");
//verify.navigationItemsListContains("y", "var");
//verify.navigationItemsListContains("x", "var");
//verify.navigationItemsListContains("z", "var");
//verify.navigationItemsCount(5);

