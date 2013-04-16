/// <reference path='FourSlash.ts' />

////interface Number {
////    toString(radix?: number): string;
////    toFixed(fractionDigits?: number): string;
////    toExponential(fractionDigits?: number): string;
////    toPrecision(precision: number): string;
////}

////() => {
////    var foo = 0;
////    /*requestCompletion*/
////    foo./*memberCompletion*/toString;
////}/*editDeclaration*/

goTo.marker("requestCompletion");
verify.memberListContains("foo");

goTo.marker("memberCompletion");
verify.memberListContains("toExponential");

// Now change the decl by adding a semicolon
goTo.marker("editDeclaration");
edit.insert(";");

// foo should still be there
goTo.marker("requestCompletion");
verify.memberListContains("foo");

goTo.marker("memberCompletion");
verify.memberListContains("toExponential");
