///<reference path="fourslash.ts"/>

////var tt = { aa };/**/
////var y = /*1*/"unclosed string literal/*2*/
////var x = "closed string literal"
verify.errorExistsBeforeMarker();
verify.errorExistsBetweenMarkers("1", "2");
verify.not.errorExistsAfterMarker("2");


