/// <reference path='FourSlash.ts' />

////interface MyPoint {
////    x1: number;
////    y1: number;
////}

////var p1: MyPoint = {
////    /*1*/
////};

goTo.marker("1");
verify.memberListContains("x1");
verify.memberListContains("y1");


////var p2: MyPoint = {
////    /*2*/x1: 5,
////    /*3*/
////};

goTo.marker("2");
verify.not.memberListContains("x1");
verify.memberListContains("y1");

goTo.marker("3");
verify.not.memberListContains("x1");
verify.memberListContains("y1");


////var p3: MyPoint = {
////    x1: /*4*/
////};

goTo.marker("4");
verify.not.memberListContains("x1");
verify.not.memberListContains("y1");


////var p4: any = {
////    /*5*/
////}

goTo.marker("5");
verify.completionListIsEmpty();


// Cast expressions
////var x = (<MyPoint>{
////    /*6*/x1: 0,
////});

goTo.marker("6");
verify.not.memberListContains("x1");
verify.memberListContains("y1");


// Call expression
////function bar(e: MyPoint) { }
////bar({
////    /*7*/
////});
goTo.marker("7");
verify.memberListContains("x1");
verify.memberListContains("y1");


// New Expression
////class bar2 {
////    constructor(e: MyPoint) { }
////}
////
////new bar2({
////    x1: 0,
////    /*8*/
////});

goTo.marker("8");
verify.not.memberListContains("x1");
verify.memberListContains("y1");