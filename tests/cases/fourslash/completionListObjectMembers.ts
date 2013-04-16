/// <reference path='FourSlash.ts' />

//// var object: {
////     (bar: any): any;
////     new (bar: any): any;
////     [bar: any]: any;
////     bar: any;
////     foo(bar: any): any;
//// };
////object./**/

goTo.marker();
verify.memberListContains("bar");
verify.memberListContains("foo");
