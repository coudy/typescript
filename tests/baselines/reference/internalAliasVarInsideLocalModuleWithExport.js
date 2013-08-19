define(["require", "exports"], function(require, exports) {
    (function (a) {
        a.x = 10;
    })(exports.a || (exports.a = {}));
    var a = exports.a;

    (function (c) {
        c.b = a.x;
        c.bVal = b;
    })(exports.c || (exports.c = {}));
    var c = exports.c;
});
