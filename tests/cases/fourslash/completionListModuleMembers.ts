/// <reference path="fourslash.ts" />

//// module Module {
////     var innerVariable = 1;
////     function innerFunction() { }
////     class innerClass { }
////     module innerModule { }
////     interface innerInterface {}
////     export var exprtedVariable = 1;
////     export function exportedFunction() { }
////     export class exportedClass { }
////     export module exportedModule { export var exportedInnerModuleVariable = 1; }
////     export interface exportedInterface {}
//// }
////Module./*ValueReference*/;
////var x : Module./*TypeReference*/


goTo.marker("ValueReference");
verify.memberListContains("exprtedVariable");
verify.memberListContains("exportedFunction");
verify.memberListContains("exportedClass");
verify.memberListContains("exportedModule");
// No inner declarations
verify.not.memberListContains("innerVariable");
verify.not.memberListContains("innerClass");
// No type declarations
verify.not.memberListContains("exportedInterface");

goTo.marker("TypeReference");
verify.memberListContains("exportedClass");
verify.memberListContains("exportedModule");
verify.memberListContains("exportedInterface");
// No value completions
verify.not.memberListContains("exprtedVariable");
