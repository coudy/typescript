/// <reference path='fourslash.ts' />


//// class C<T, U extends T> {
////     constructor() { }
////     foo(a: T) {
////     }
//// }
//// 
//// interface I1 {
////     a: string;/*1*/
//// };
//// 
//// interface I2 {
////     a: number;
////     b: string;
//// }
//// 
//// var x = new C< { a: number; }, { a: number; b: string; }>();
//// var y = new C<I1, I2>();
//// var z = new C<I2, I1>()

// BUG 654459
verify.numberOfErrorsInCurrentFile(0);

goTo.marker("1");
edit.backspace(10);

// BUG 654459
verify.numberOfErrorsInCurrentFile(0);

edit.insert("a: number;");
verify.numberOfErrorsInCurrentFile(0);
