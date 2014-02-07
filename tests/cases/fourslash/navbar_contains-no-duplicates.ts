/// <reference path="fourslash.ts" />
//// declare module Windows {
////     export module Foundation {
////         export var A;
////         export class Test {
////             public wow();
////         }
////     }
//// }
//// 
//// declare module Windows {
////     export module Foundation {
////         export var B;
////         export module Test {
////             export function Boom(): number;
////         }
////     }
//// }
//// 
//// class ABC {
////     public foo() {
////         return 3;
////     }
//// }
//// 
//// module ABC {
////     export var x = 3;
//// }

verify.getScriptLexicalStructureListCount(12);
verify.getScriptLexicalStructureListContains("ABC", "module");
verify.getScriptLexicalStructureListContains("ABC", "class");
verify.getScriptLexicalStructureListContains("Windows", "module");
