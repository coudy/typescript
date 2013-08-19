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
