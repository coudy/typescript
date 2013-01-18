/// <reference path="fourslash.ts"/>

////var x = /*1*/"asd/*2*/

verify.errorExistsBetweenMarkers("1", "2");
verify.numberOfErrorsInCurrentFile(1);




