// bug 761807: module in type positon using typeof included in 'define' statement in javascript
declare module 'a' {
    export class B {
        id: number;
    }
}

// this generated invalid javascript in AMD modules, the 'a' is added to the define.
import a = require('a'); 
var x: typeof a;