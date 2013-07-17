
exports.x;
exports.x.foo();


////[internalAliasUninitializedModuleInsideTopLevelModuleWithExport.d.ts]
export declare module a.b {
    interface I {
        foo();
    }
}
export import b = a.b;
export declare var x: a.b.I;
