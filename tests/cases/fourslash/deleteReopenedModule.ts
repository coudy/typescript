/// <reference path="fourslash.ts" />

/////*start*/module M {
////    export class C { }
//// }/*end*/
////
////module M { }
////
////var c = new M.C();

goTo.marker('start');

var length = test.markers()[1].position - test.markers()[0].position;
// Bug 679478: "Cannot call method 'getDisplayName' of undefined" when deleting first declaration of re-opened module
// edit.deleteAtCaret(length);
