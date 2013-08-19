//@module: amd
declare module "winjs" {

export class Promise {

static timeout(delay: number): Promise;




}

}


import WinJS = require('winjs');




WinJS.Promise.timeout(10);
