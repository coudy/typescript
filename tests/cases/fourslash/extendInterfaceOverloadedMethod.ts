/// <reference path='fourslash.ts'/>

////interface A<T> {
////    foo(a: T): B<T>;
////    foo(): void ;
////    foo2(): B<number>;
////}
////interface B<T> extends A<T> {
////    bar(): void ;
////}
////var b: B<number>;
////var x/**/ = b.foo2().foo(5).foo(); // 'x' is of type 'void'

goTo.marker();
// Bug 778445: Wrong error here
// verify.quickInfoIs('void');
// verify.numberOfErrorsInCurrentFile(0);
verify.quickInfoIs('any');
verify.numberOfErrorsInCurrentFile(2);
