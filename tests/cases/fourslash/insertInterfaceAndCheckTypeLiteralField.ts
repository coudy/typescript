/// <reference path="fourslash.ts" />

//// /*addC*/
//// interface G<T, U> { }
//// var v2: G<{ a: /*checkParam*/string }, C>;

goTo.marker('addC');
edit.insert('interface C { }');

goTo.marker('checkParam');
// Bug 674709: Exception "Cannot call method 'getSymbol' of undefined" when getting symbol in type literal in generic type argument position
//verify.quickInfoExists();
