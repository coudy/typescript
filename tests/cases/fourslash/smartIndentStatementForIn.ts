/// <reference path='fourslash.ts'/>

////function Foo() {
////    for (var i in [])
////    {
////        /*insideStatement*/
////    }
////    /*afterStatement*/
////}

goTo.marker('insideStatement');
verify.smartIndentLevelIs(2);

goTo.marker('afterStatement');
verify.smartIndentLevelIs(1);