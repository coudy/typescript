define(["require", "exports"], function(require, exports) {
    var m2;
    
    return m2;
});

define(["require", "exports", "declFileImportModuleWithExportAssignment_0"], function(require, exports, __a1__) {
    /**This is on import declaration*/
    var a1 = __a1__;
    exports.a1 = a1;
    exports.a = exports.a1;
    exports.a.test1(null, null, null);
});

////[declFileImportModuleWithExportAssignment_0.d.ts]
declare module m2 {
    interface connectModule {
        (res, req, next): void;
    }
    interface connectExport {
        use: (mod: connectModule) => connectExport;
        listen: (port: number) => void;
    }
}
declare var m2: {
    test1: m2.connectModule;
    test2(): m2.connectModule;
    (): m2.connectExport;
};
export = m2;

////[declFileImportModuleWithExportAssignment.d.ts]
/**This is on import declaration*/
export import a1 = require("declFileImportModuleWithExportAssignment_0");
export declare var a: {
    test1: a1.connectModule;
    test2(): a1.connectModule;
    (): a1.connectExport;
};
