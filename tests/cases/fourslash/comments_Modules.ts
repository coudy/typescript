/// <reference path='fourslash.ts' />

/////// Module comment
////module m/*1*/1 {
////    /// b's comment
////    export var b: number;
////    /// foo's comment
////    function foo() {
////        return /*2*/b;
////    }
////    /// m2 comments
////    export module m2 {
////        /// class comment;
////        export class c {
////        };
////        /// i
////        export var i = new c();
////    }
////    /// exported function
////    export function fooExport() {
////        return foo(/*3*/);
////    }
////}
/////*4*/m1./*5*/fooExport(/*6*/);
////var my/*7*/var = new m1.m2./*8*/c();
/////// module comment of m2.m3
////module m2.m3 {
////    /// Exported class comment
////    export class c {
////    }
////}
////new /*9*/m2./*10*/m3./*11*/c();
/////// module comment of m3.m4.m5
////module m3.m4.m5 {
////    /// Exported class comment
////    export class c {
////    }
////}
////new /*12*/m3./*13*/m4./*14*/m5./*15*/c();
/////// module comment of m4.m5.m6
////module m4.m5.m6 {
////    export module m7 {
////        /// Exported class comment
////        export class c {
////        }
////    }
////}
////new /*16*/m4./*17*/m5./*18*/m6./*19*/m7./*20*/c();
/////// module comment of m5.m6.m7
////module m5.m6.m7 {
////    /// module m8 comment
////    export module m8 {
////        /// Exported class comment
////        export class c {
////        }
////    }
////}
////new /*21*/m5./*22*/m6./*23*/m7./*24*/m8./*25*/c();
////module m6.m7 {
////    export module m8 {
////        /// Exported class comment
////        export class c {
////        }
////    }
////}
////new /*26*/m6./*27*/m7./*28*/m8./*29*/c();
////module m7.m8 {
////    /// module m9 comment
////    export module m9 {
////        /// Exported class comment
////        export class c {
////        }
////    }
////}
////new /*30*/m7./*31*/m8./*32*/m9./*33*/c();

goTo.marker('1');
verify.quickInfoIs("m1\nModule comment");

goTo.marker('2');
verify.completionListContains("b", "number", "b's comment");
verify.completionListContains("foo", "() => number", "foo's comment");

goTo.marker('3');
verify.currentSignatureHelpDocCommentIs("foo's comment");

goTo.marker('4');
verify.completionListContains("m1", "m1", "Module comment");

goTo.marker('5');
verify.memberListContains("b", "number", "b's comment");
verify.memberListContains("fooExport", "() => number", "exported function");
verify.memberListContains("m2", "m1.m2", "m2 comments");

goTo.marker('6');
verify.currentSignatureHelpDocCommentIs("exported function");

goTo.marker('7');
verify.quickInfoIs("m1.m2.c\nclass comment;");

goTo.marker('8');
verify.memberListContains("c", "new() => m1.m2.c", "class comment;");
verify.memberListContains("i", "m1.m2.c", "i");

goTo.marker('9');
verify.completionListContains("m2", "m2", "");
verify.quickInfoIs("m2");

goTo.marker('10');
verify.memberListContains("m3", "m2.m3", "module comment of m2.m3");
verify.quickInfoIs("m2.m3\nmodule comment of m2.m3");

goTo.marker('11');
verify.memberListContains("c", "new() => m2.m3.c", "Exported class comment");
verify.quickInfoIs("new() => m2.m3.c\nExported class comment");

goTo.marker('12');
verify.completionListContains("m3", "m3", "");
verify.quickInfoIs("m3");

goTo.marker('13');
verify.memberListContains("m4", "m3.m4", "");
verify.quickInfoIs("m3.m4");

goTo.marker('14');
verify.memberListContains("m5", "m3.m4.m5", "module comment of m3.m4.m5");
verify.quickInfoIs("m3.m4.m5\nmodule comment of m3.m4.m5");

goTo.marker('15');
verify.memberListContains("c", "new() => m3.m4.m5.c", "Exported class comment");
verify.quickInfoIs("new() => m3.m4.m5.c\nExported class comment");

goTo.marker('16');
verify.completionListContains("m4", "m4", "");
verify.quickInfoIs("m4");

goTo.marker('17');
verify.memberListContains("m5", "m4.m5", "");
verify.quickInfoIs("m4.m5");

goTo.marker('18');
verify.memberListContains("m6", "m4.m5.m6", "module comment of m4.m5.m6");
verify.quickInfoIs("m4.m5.m6\nmodule comment of m4.m5.m6");

goTo.marker('19');
verify.memberListContains("m7", "m4.m5.m6.m7", "");
verify.quickInfoIs("m4.m5.m6.m7");

goTo.marker('20');
verify.memberListContains("c", "new() => m4.m5.m6.m7.c", "Exported class comment");
verify.quickInfoIs("new() => m4.m5.m6.m7.c\nExported class comment");

goTo.marker('21');
verify.completionListContains("m5", "m5", "");
verify.quickInfoIs("m5");

goTo.marker('22');
verify.memberListContains("m6", "m5.m6", "");
verify.quickInfoIs("m5.m6");

goTo.marker('23');
verify.memberListContains("m7", "m5.m6.m7", "module comment of m5.m6.m7");
verify.quickInfoIs("m5.m6.m7\nmodule comment of m5.m6.m7");

goTo.marker('24');
verify.memberListContains("m8", "m5.m6.m7.m8", "module m8 comment");
verify.quickInfoIs("m5.m6.m7.m8\nmodule m8 comment");

goTo.marker('25');
verify.memberListContains("c", "new() => m5.m6.m7.m8.c", "Exported class comment");
verify.quickInfoIs("new() => m5.m6.m7.m8.c\nExported class comment");

goTo.marker('26');
verify.completionListContains("m6", "m6", "");
verify.quickInfoIs("m6");

goTo.marker('27');
verify.memberListContains("m7", "m6.m7", "");
verify.quickInfoIs("m6.m7");

goTo.marker('28');
verify.memberListContains("m8", "m6.m7.m8", "");
verify.quickInfoIs("m6.m7.m8");

goTo.marker('29');
verify.memberListContains("c", "new() => m6.m7.m8.c", "Exported class comment");
verify.quickInfoIs("new() => m6.m7.m8.c\nExported class comment");

goTo.marker('30');
verify.completionListContains("m7", "m7", "");
verify.quickInfoIs("m7");

goTo.marker('31');
verify.memberListContains("m8", "m7.m8", "");
verify.quickInfoIs("m7.m8");

goTo.marker('32');
verify.memberListContains("m9", "m7.m8.m9", "module m9 comment");
verify.quickInfoIs("m7.m8.m9\nmodule m9 comment");

goTo.marker('33');
verify.memberListContains("c", "new() => m7.m8.m9.c", "Exported class comment");
verify.quickInfoIs("new() => m7.m8.m9.c\nExported class comment");