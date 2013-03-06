/// <reference path='fourslash.ts' />

////var v1 = '';
////" /*openString1*/

////var v2 = '';
////"/*openString2*/


////var v3 = '';
////" bar./*openString3*/

////var v4 = '';
////// bar./*inComment1*/

////var v6 = '';
////// /*inComment2*/


var markers = [
    "openString1", 
    "openString2", 
    "openString3",
    //"inComment1",
    //"inComment2"
];

markers.forEach((m) => {
    goTo.marker(m);
    verify.completionListIsEmpty();
});

