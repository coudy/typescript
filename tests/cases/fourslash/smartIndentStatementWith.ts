/// <reference path='fourslash.ts'/>

////function Foo() {
////    var obj = { a: 'foo' };
////    with (obj) {
////        /*insideStatement*/
////    }
////    /*afterStatement*/
////}

goTo.marker('insideStatement');
verify.smartIndentLevelIs(2);

goTo.marker('afterStatement');
verify.smartIndentLevelIs(1);