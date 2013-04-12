/// <reference path="fourslash.ts" />

//// class Dictionary<V> {
//// }
//// 
//// module Maps {
////    class C1 extends D/*1*/ictionary<string> { }
////    /*2*/
//// }
//// 

// Sanity check: type name here should include the type parameter
goTo.marker('1');
verify.quickInfoSymbolNameIs('Dictionary<V>');

// Add a similar class -- name does not match
goTo.marker('2');
edit.insert("class C2 extends Dictionary<string> { }");
edit.moveLeft('ictionary<string> { }'.length);
// Bug 664985: Expected second instance here to have the same symbol name
// verify.quickInfoSymbolNameIs('Dictionary<V>');
verify.quickInfoSymbolNameIs('Dictionary');
