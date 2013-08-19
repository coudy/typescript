function makePoint(x) {
    return {
        get x() {
            return x;
        }
    };
}
;
var point = makePoint(2);
var x = point.x;
