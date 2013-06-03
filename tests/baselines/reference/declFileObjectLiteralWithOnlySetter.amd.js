function makePoint(x) {
    return {
        b: 10,
        set x(a) {
            this.b = a;
        }
    };
}
;
var point = makePoint(2);
point.x = 30;

////[0.d.ts]
declare function makePoint(x: number): {
    b: number;
    x: number;
};
declare var point: {
    b: number;
    x: number;
};
