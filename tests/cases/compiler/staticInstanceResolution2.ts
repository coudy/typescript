declare module "winjs" {
    export class Promise {
        static timeout(delay: number): Promise;
    }
}

import WinJS = module('winjs');

class A { }
A.hasOwnProperty('foo');

class B {
    constructor() { }
}
B.hasOwnProperty('foo');

WinJS.Promise.timeout(10);

