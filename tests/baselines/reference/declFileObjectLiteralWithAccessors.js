//// [declFileObjectLiteralWithAccessors.js]
function makePoint(x) {
    return {
        b: 10,
        get x() {
            return x;
        },
        set x(a) {
            this.b = a;
        }
    };
}
;
var point = makePoint(2);
var x = point.x;
point.x = 30;


////[declFileObjectLiteralWithAccessors.d.ts]
declare function makePoint(x: number): {
    b: number;
    x: number;
};
declare var point: {
    b: number;
    x: number;
};
declare var x: number;
