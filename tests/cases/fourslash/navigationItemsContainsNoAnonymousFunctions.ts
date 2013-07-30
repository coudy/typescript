/// <reference path="fourslash.ts"/>
// @Filename: navigationItemsContainsNoAnonymousFunctions_0.ts
/////*file1*/
////(function() {
////    // this should not be included
////    var x = 0;
////
////    // this should not be included either
////    function foo() {
////
////    }
////})();

// @Filename: navigationItemsContainsNoAnonymousFunctions_1.ts
/////*file2*/
////var x = function() {
////    // this should not be included
////    var x = 0;
////    
////    // this should not be included either
////    function foo() {
////};

// @Filename: navigationItemsContainsNoAnonymousFunctions_2.ts
////// Named functions should still show up
/////*file3*/
////function foo() {
////}
////function bar() {
////}

goTo.marker("file1");
verify.navigationItemsCount(0);

goTo.marker("file2");
verify.navigationItemsCount(1);

goTo.marker("file3");
verify.navigationItemsCount(2);