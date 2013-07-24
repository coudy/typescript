/// <reference path='fourslash.ts' />

// BUG 745030
/////0./*dotOnNumberExrpressions1*/
/////0.0./*dotOnNumberExrpressions2*/
//////0.0.0./*dotOnNumberExrpressions3*/
/////0./** comment *//*dotOnNumberExrpressions4*/
/////(0)./*validDotOnNumberExrpressions1*/
/////(0.)./*validDotOnNumberExrpressions2*/
/////(0.0)./*validDotOnNumberExrpressions3*/

//goTo.marker("dotOnNumberExrpressions1");
//verify.completionListIsEmpty();

//goTo.marker("dotOnNumberExrpressions2");
//verify.completionListIsEmpty();

//goTo.marker("dotOnNumberExrpressions3");
//verify.completionListIsEmpty();

//goTo.marker("dotOnNumberExrpressions4");
//verify.completionListIsEmpty();

//goTo.marker("validDotOnNumberExrpressions1");
//verify.completionListContains("toExponential");

//goTo.marker("validDotOnNumberExrpressions2");
//verify.completionListContains("toExponential");

//goTo.marker("validDotOnNumberExrpressions3");
//verify.completionListContains("toExponential");
