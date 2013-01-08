/// <reference path="fourslash.ts" />

////class Foo {
////    constructor(/*/**/*/) { }
////}

goTo.marker();
verify.completionListIsEmpty();

class foo {
    constructor(/*var x = "what"; x -= 1;*/) { }
}