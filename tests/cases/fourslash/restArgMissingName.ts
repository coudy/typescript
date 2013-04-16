/// <reference path='FourSlash.ts' />

////function sum(/*1*/.../*2*/)/*3*/ { }

verify.errorExistsBetweenMarkers("1", "2");
verify.errorExistsBetweenMarkers("2", "3");
verify.numberOfErrorsInCurrentFile(2);

