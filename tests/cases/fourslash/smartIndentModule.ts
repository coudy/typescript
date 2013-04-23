/// <reference path='fourslash.ts'/>

////module Foo {
////    /*insideModule*/
////}
/////*afterModule*/

goTo.marker('insideModule');
verify.smartIndentLevelIs(1);

goTo.marker('afterModule');
verify.smartIndentLevelIs(0);
