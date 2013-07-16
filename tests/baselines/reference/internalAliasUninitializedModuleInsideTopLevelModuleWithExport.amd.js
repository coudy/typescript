define(["require", "exports"], function(require, exports) {
    
    exports.x;
    exports.x.foo();
});

////[0.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export import b = a.b;
export declare var x: a.b.I;
