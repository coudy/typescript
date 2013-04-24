/// <reference path="fourslash.ts" />

//// try {} catch(e) { }
//// /**/

goTo.marker();
// Bug 673264: Exception in decl differ after inserting a second consecutive try/catch block
// edit.insert('try {} catch(e) { }');
