//@module: amd
// @Filename: staticInstanceResolution5_0.ts
declare module "winjs" {
    export class Promise {
        static timeout(delay: number): Promise;
    }
}
// @Filename: staticInstanceResolution5_1.ts
///<reference path='staticInstanceResolution5_0.ts'/>
import WinJS = require('winjs');

// these 3 should be errors
var x = (w1: WinJS) => { };
var y = function (w2: WinJS) { }
function z(w3: WinJS) { }
