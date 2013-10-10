/// <reference path='fourslash.ts' />

// Negative tests

//////inside a comment foo(/*insideComment*/
////cl/*invalidContext*/ass InvalidSignatureHelpLocation { }
////InvalidSignatureHelpLocation(/*invalidContext2*/);

goTo.marker('insideComment');
verify.not.signatureHelpPresent();

goTo.marker('invalidContext');
verify.not.signatureHelpPresent();

goTo.marker('invalidContext2');
//verify.not.signatureHelpPresent();