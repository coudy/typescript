/// <reference path='fourslash.ts' />

////function functionOverload();
////function functionOverload(value: string);
/////*functionOverloadDefinition*/function functionOverload(value: any) {}
////
/////*functionOverloadReference*/functionOverload()

goTo.marker('functionOverloadReference');
goTo.definition();
verify.caretAtMarker('functionOverloadDefinition');
