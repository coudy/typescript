
exports.x;
exports.x.foo();


////[0.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export declare var x: a.b.I;
