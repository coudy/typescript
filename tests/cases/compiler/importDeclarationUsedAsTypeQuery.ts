declare module 'a' {
    export class B {
        id: number;
    }
}
import a = require('a');
var x: typeof a;
