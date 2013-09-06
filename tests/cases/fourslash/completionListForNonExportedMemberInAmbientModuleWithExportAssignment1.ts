/// <reference path="fourslash.ts"/>

// @Filename: completionListForNonExportedMemberInAmbientModuleWithExportAssignment1_file0.ts
//// declare module "test" {
////     var x: Date;
////     export = x;
//// }
//// 

// @Filename: completionListForNonExportedMemberInAmbientModuleWithExportAssignment1_file1.ts
///////<reference path='completionListForNonExportedMemberInAmbientModuleWithExportAssignment1_file0.ts'/>
//// import test = require("test");
//// test./**/
////

goTo.marker();
verify.not.memberListContains("x");