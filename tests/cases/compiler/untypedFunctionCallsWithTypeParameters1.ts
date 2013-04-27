// none of these function calls should be allowed
var x = function () { return; };
var r1 = x<number>();
var y: any = x;
var r2 = y<string>();

var c: Function;
var r3 = c<number>(); 

class C implements Function {
    prototype = null;
    length = 1;
    arguments = null;
    caller = () => { };
}
var c2: C;
var r4 = c2<number>();

interface I {
    (number): number;
}
var z: I;
var r5 = z<string>(1);