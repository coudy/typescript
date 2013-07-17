define(["require", "exports"], function(require, exports) {
    (function (c) {
        
        c.x;
        c.x.foo();
    })(exports.c || (exports.c = {}));
    var c = exports.c;
});

////[internalAliasUninitializedModuleInsideLocalModuleWithExport.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export declare module c {
    import b = a.b;
    var x: a.b.I;
}
