/// <reference path='fourslash.ts' />

////class ConstructorOverload {
////    constructor();
////    constructor(foo: string);
////    /*constructorOverloadDefinition*/constructor(foo: any)  { }
////}
////
////var constructorOverload = new /*constructorOverloadReference*/ConstructorOverload();

goTo.marker('constructorOverloadReference');
goTo.definition();
verify.caretAtMarker('constructorOverloadDefinition');
