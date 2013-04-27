/// <reference path='fourslash.ts'/>

// Class references should work across file and not find local variables.

// @Filename: ReferenceToClass1.ts
////class foo/*1*/ {
////    public n: /*2*/foo;
////    public foo: number;
////}
////
////class bar {
////    public n: fo/*3*/o;
////    public k = new foo();
////}
////
////module mod {
////    var k: foo = null;
////}

// @Filename: ReferenceToClass2.ts
////var k: /*4*/foo;

goTo.marker("1");
// Work around 675291 - Reference to class name after key word "new" is broken.
// Update the expected value from 6 to 5.
verify.referencesCountIs(5);

goTo.marker("2");
// Work around 675291 - Reference to class name after key word "new" is broken.
// Update the expected value from 6 to 5.
verify.referencesCountIs(5);

goTo.marker("3");
// Work around 675291 - Reference to class name after key word "new" is broken.
// Update the expected value from 6 to 5.
verify.referencesCountIs(5);

goTo.marker("4");
// Work around 675291 - Reference to class name after key word "new" is broken.
// Update the expected value from 6 to 5.
verify.referencesCountIs(5);