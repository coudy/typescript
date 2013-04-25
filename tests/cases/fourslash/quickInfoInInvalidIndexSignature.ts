/// <reference path="fourslash.ts" />

//// function method() { var dictionary = <{ /**/[index]: string; }>{}; }

goTo.marker();
// Bug 673229: Exception "Cannot call method 'getTypeNameEx' of null" trying to get quick info in invalid index signature
verify.quickInfoExists();
