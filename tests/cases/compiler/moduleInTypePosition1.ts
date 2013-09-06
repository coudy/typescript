//@module: commonjs
// @Filename: moduleInTypePosition1_0.ts
declare module "winjs" {
    export class Promise {
    }
}
// @Filename: moduleInTypePosition1_1.ts
///<reference path='moduleInTypePosition1_0.ts'/>
import WinJS = require('winjs');
var x = (w1: WinJS) => { };
