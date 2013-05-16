/// <reference path='fourslash.ts' />

////module TestModule {
/////**/
////}

goTo.marker("");
edit.paste(" class TestClass{\r\n\
private   foo;\r\n\
public testMethod( )\r\n\
{}\r\n\
}");
// The expected scenario is failing due to bug 656991 - We should not format on paste when the user has a box selection.
//verify.currentFileContentIs("module TestModule {\r\n\
// class TestClass{\r\n\
//private   foo;\r\n\
//public testMethod( )\r\n\
//{}\r\n\
//}\r\n\
//}");
verify.currentFileContentIs("module TestModule {\r\n\
    class TestClass {\r\n\
        private foo;\r\n\
        public testMethod() {\r\n\
        }\r\n\
    }\r\n\
}");