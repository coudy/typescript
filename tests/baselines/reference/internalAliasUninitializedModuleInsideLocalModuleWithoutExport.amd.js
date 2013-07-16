define(["require", "exports"], function(require, exports) {
    (function (c) {
        
        c.x;
        c.x.foo();
    })(exports.c || (exports.c = {}));
    var c = exports.c;
});

////[0.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export declare module c {
    var x: a.b.I;
}
