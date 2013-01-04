/// <reference path="fourslash.ts" />

////function alpha() {

////    var x = "x\
////    /*1*/
////    var y = 1;
////    
////}   /*2*/

verify.not.errorExistsBetweenMarkers("1", "2");