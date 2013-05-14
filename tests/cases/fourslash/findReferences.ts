/// <reference path='fourslash.ts' />

////class /*className*/foo {
////    constructor() {
////    }
////    public get /*barMethodName*/bar() {
////        return 0;
////    }
////    static /*staticMethodName*/method() { }
////}
////var n: /*varTypeName*/foo = new /*ctorInvocation*/foo();
////var x = n./*barMethodInvocation*/bar();
////foo./*staticMethodInvocation*/method();

var foo1: FourSlashInterface.Range = { fileName: "file_0.ts", start: 6, end: 9};
var bar1: FourSlashInterface.Range = { fileName: "file_0.ts", start: 53, end: 56};
var method1: FourSlashInterface.Range = { fileName: "file_0.ts", start: 96, end: 102};
var foo2: FourSlashInterface.Range = { fileName: "file_0.ts", start: 118, end: 121};
var foo3: FourSlashInterface.Range = { fileName: "file_0.ts", start: 128, end: 131};
var bar2: FourSlashInterface.Range = { fileName: "file_0.ts", start: 145, end: 148};
var foo4: FourSlashInterface.Range = { fileName: "file_0.ts", start: 152, end: 155};
var method2: FourSlashInterface.Range = { fileName: "file_0.ts", start: 156, end: 162};

goTo.marker('className');
verify.occurancesAtPositionContains(foo1);
verify.occurancesAtPositionContains(foo2);
verify.occurancesAtPositionContains(foo3);
verify.occurancesAtPositionContains(foo4);

goTo.marker('barMethodName');
verify.occurancesAtPositionContains(bar1);
verify.occurancesAtPositionContains(bar2);

goTo.marker('staticMethodName');
verify.occurancesAtPositionContains(method1);
verify.occurancesAtPositionContains(method2);

goTo.marker('varTypeName');
verify.occurancesAtPositionContains(foo1);
verify.occurancesAtPositionContains(foo2);
verify.occurancesAtPositionContains(foo3);
verify.occurancesAtPositionContains(foo4);

goTo.marker('barMethodInvocation');
verify.occurancesAtPositionContains(bar1);
verify.occurancesAtPositionContains(bar2);

goTo.marker('ctorInvocation');
verify.occurancesAtPositionContains(foo1);
verify.occurancesAtPositionContains(foo2);
verify.occurancesAtPositionContains(foo3);
verify.occurancesAtPositionContains(foo4);

goTo.marker('staticMethodInvocation');
verify.occurancesAtPositionContains(method1);
verify.occurancesAtPositionContains(method2);