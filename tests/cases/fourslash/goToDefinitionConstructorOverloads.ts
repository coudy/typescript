/// <reference path='fourslash.ts' />

////class ConstructorOverload {
////    /*constructorOverload*/constructor();
////    constructor(foo: string);
////    /*constructorOverloadDefinition*/constructor(foo: any)  { }
////}
////
////var constructorOverload = new /*constructorOverloadReference*/ConstructorOverload();

goTo.marker('constructorOverloadReference');
goTo.definition();
verify.caretAtMarker('constructorOverloadDefinition');

goTo.marker('constructorOverload');
goTo.definition();
verify.caretAtMarker('constructorOverloadDefinition');
