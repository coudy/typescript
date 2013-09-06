//@module: amd
// @Filename: memberAccessMustUseModuleInstances_0.ts
declare module "winjs" {

export class Promise {

static timeout(delay: number): Promise;




}

}

// @Filename: memberAccessMustUseModuleInstances_1.ts
///<reference path='memberAccessMustUseModuleInstances_0.ts'/>
import WinJS = require('winjs');




WinJS.Promise.timeout(10);
