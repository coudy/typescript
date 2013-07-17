define(["require", "exports"], function(require, exports) {
    
    exports.x;
    exports.x.foo();
});

////[internalAliasUninitializedModuleInsideTopLevelModuleWithoutExport.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export declare var x: a.b.I;
