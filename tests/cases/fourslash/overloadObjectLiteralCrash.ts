/// <reference path="fourslash.ts" />

//// interface Foo {
////     extend<T>(...objs: any[]): T;
////     extend<T>(deep, target: T): T;
//// }
//// var $: Foo;
//// $.extend({ /**/foo: 0 }, "");
//// 

goTo.marker();
// Bug 679481: Error "Cannot call method 'isPrimitive' of null" getting quick info in object literal property name in generic function overload invoke
// verify.quickInfoExists();