//@module: commonjs
// @Filename: staticInstanceResolution3_0.ts
declare module "winjs" {
    export class Promise {
        static timeout(delay: number): Promise;
    }
}
// @Filename: staticInstanceResolution3_1.ts
///<reference path='staticInstanceResolution3_0.ts'/>
import WinJS = require('winjs');
WinJS.Promise.timeout(10);