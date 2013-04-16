/// <reference path='fourslash.ts' />

// Negative tests

//////inside a comment foo(/*insideComment*/

goTo.marker('insideComment');
verify.not.signatureHelpPresent();


////cl/*invalidContext*/ass InvalidSignatureHelpLocation { } 

goTo.marker('invalidContext');
verify.not.signatureHelpPresent();
