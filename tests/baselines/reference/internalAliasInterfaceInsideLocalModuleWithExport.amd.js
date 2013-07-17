define(["require", "exports"], function(require, exports) {
    (function (c) {
        
        c.x;
    })(exports.c || (exports.c = {}));
    var c = exports.c;
});

////[internalAliasInterfaceInsideLocalModuleWithExport.d.ts]
export declare module a {
    interface I {
    }
}
export declare module c {
    import b = a.I;
    var x: a.I;
}
