var MyClass = (function () {
    function MyClass() { }
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
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["MyClass","MyClass.constructor","MyClass.get_Count","MyClass.set_Count"],"mappings":"AAKA;IAAAA;AAWCA,IATGA;QAAAA,KAAAA;YAEIE,OAAOA,EAAEA,CAACA;QACdA,CAACA;QAEDF,KAAAA,UAAiBA,KAAaA;QAG9BG,CAACA;;;;AALAH,IAMLA;AAACA,CAAAA,IAAA"}
////[comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[importInsideModule_file1.js]
//@ sourceMappingURL=importInsideModule_file1.js.map
////[importInsideModule_file2.js]
//@ sourceMappingURL=importInsideModule_file2.js.map
////[0.d.ts]
class MyClass {
    public Count : number;
}