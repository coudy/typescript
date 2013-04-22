/// <reference path="fourslash.ts" />

//// 
//// interface Intersection {
////     /*insertHere*/
//// }
//// interface Scene { }
//// class /*className*/Sphere {
////     constructor() {
////     }
//// }

goTo.marker('className');
verify.quickInfoSymbolNameIs('Sphere');

goTo.marker('insertHere');
edit.insert("ray: Ray;");

goTo.marker('className');
// Bug: 123456789
// verify.quickInfoSymbolNameIs('Sphere');
verify.quickInfoSymbolNameIs('');
