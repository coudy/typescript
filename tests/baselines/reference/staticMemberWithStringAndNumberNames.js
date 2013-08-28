var C = (function () {
    function C() {
        this.x = C['foo'];
        this.x2 = C['0'];
        this.x3 = C[0];
    }
    C["foo"] = 0;
    C[0] = 1;

    C.s = C['foo'];
    C.s2 = C['0'];
    C.s3 = C[0];
    return C;
})();
