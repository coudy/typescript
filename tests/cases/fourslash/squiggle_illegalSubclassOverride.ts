/// <reference path="fourslash.ts"/>

////class Foo {
////    public x: number;
////}

////class Bar extends Foo {
////    /*1*/public x: string;/*2*/
////}

verify.errorExistsBetweenMarkers("1", "2");
verify.numberOfErrorsInCurrentFile(1);




