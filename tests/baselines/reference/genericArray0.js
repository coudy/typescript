//// [genericArray0.js]
var x;

var y = x;

function map() {
    var ys = [];
}


////[genericArray0.d.ts]
declare var x: number[];
declare var y: number[];
declare function map<U>(): void;
