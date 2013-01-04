/// <reference path="fourslash.ts" />

////function alpha() {

////    var x = "x\
////    var y = 1;
////    function beta() { }
////    beta(/*1*/;/*2*/
////}

verify.errorExistsBetweenMarkers("1", "2");