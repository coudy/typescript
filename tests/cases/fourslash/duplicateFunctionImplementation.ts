/// <reference path="fourslash.ts" />

//// interface IFoo<T> {
////     foo<T>(): T;
//// }
//// function foo<string>(/**/): string { return null; }
//// function foo<T>(x: T): T { return null; }

goTo.marker();
// Bug 681081: Duplicated function implementation gets treated as an overload for error reporting
// edit.insert("x: string");
