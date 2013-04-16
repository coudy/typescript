/// <reference path='FourSlash.ts' />

/////*constructorDefinition*/class ImplicitConstructor {
////}
////var implicitConstructor = new /*constructorReference*/ImplicitConstructor();

goTo.marker('constructorReference');
goTo.definition();
verify.caretAtMarker('constructorDefinition');