/// <reference path="fourslash.ts" />

//// class TestClass {
////     public function foo(x: string): void;
////     public function foo(): void;
////     foo(x: any): void {
////         this.bar(/**/x); // should not error
////     }
//// }
//// 

goTo.marker();
// Bug 672454: Cannot call method 'isResolved' of null when trying to get quickInfo on unparseable code
// verify.quickInfoSymbolNameIs('any');
