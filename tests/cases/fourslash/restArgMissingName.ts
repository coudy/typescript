/// <reference path="fourslash.ts"/>

//// function sum(.../*1*/)/*2*/ { }

verify.errorExistsBetweenMarkers("1", "2");
verify.numberOfErrorsInCurrentFile(1);

