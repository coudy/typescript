/// <reference path="fourslash.ts" />

/////**/

// Bug 768028
// FourSlash.currentTestState.enableIncrementalUpdateValidation = false;
edit.replace(0,0,"function foo(bar) {\n    b\n}\n");
goTo.position(27);
FourSlash.currentTestState.getCompletionListAtCaret().entries
  .forEach(entry =>
    console.log(FourSlash.currentTestState.getCompletionEntryDetails(entry.name)));
