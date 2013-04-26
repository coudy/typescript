/// <reference path="fourslash.ts" />

//// interface G<T, U> { }
//// /**/
//// var v4: G<G<any>, any>;

verify.numberOfErrorsInCurrentFile(1);
goTo.marker();
// Bug 674642: Incremental edit causes error about insufficient generic type arguments to go away
// edit.insert(' ');
// verify.numberOfErrorsInCurrentFile(1);
