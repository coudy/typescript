////[0.js.map]
{"version":3,"file":"0.js","sourceRoot":"","sources":["file:///0.ts"],"names":["MyClass","MyClass.constructor","MyClass.get_Count","MyClass.set_Count"],"mappings":"AACA;IAAAA;;AAWCA,IATGA;QAAAA,KAAAA;YAEIE,OAAOA,EAAEA,CAACA;QACdA,CAACA;QAEDF,KAAAA,UAAiBA,KAAaA;QAG9BG,CAACA;;;;AALAH;IAMLA;AAACA,CAAAA,IAAA"}
var MyClass = (function () {
    function MyClass() {
    }
    Object.defineProperty(MyClass.prototype, "Count", {
        get: function () {
            return 42;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });

    return MyClass;
})();
//# sourceMappingURL=0.js.map

////[importInsideModule_file1.js.map]
{"version":3,"file":"importInsideModule_file1.js","sourceRoot":"","sources":["file:///importInsideModule_file1.ts"],"names":[],"mappings":""}
////[importInsideModule_file1.js]
//# sourceMappingURL=importInsideModule_file1.js.map

////[importInsideModule_file2.js.map]
{"version":3,"file":"importInsideModule_file2.js","sourceRoot":"","sources":["file:///importInsideModule_file2.ts"],"names":[],"mappings":""}
////[importInsideModule_file2.js]
//# sourceMappingURL=importInsideModule_file2.js.map

////[modulesImportedForTypeArgumentPosition_0.js.map]
{"version":3,"file":"modulesImportedForTypeArgumentPosition_0.js","sourceRoot":"","sources":["file:///modulesImportedForTypeArgumentPosition_0.ts"],"names":[],"mappings":""}
////[modulesImportedForTypeArgumentPosition_0.js]
//# sourceMappingURL=modulesImportedForTypeArgumentPosition_0.js.map

////[modulesImportedForTypeArgumentPosition_1.js.map]
{"version":3,"file":"modulesImportedForTypeArgumentPosition_1.js","sourceRoot":"","sources":["file:///modulesImportedForTypeArgumentPosition_1.ts"],"names":[],"mappings":""}
////[modulesImportedForTypeArgumentPosition_1.js]
//# sourceMappingURL=modulesImportedForTypeArgumentPosition_1.js.map

////[0.d.ts]
declare class MyClass {
    public Count : number;
}
