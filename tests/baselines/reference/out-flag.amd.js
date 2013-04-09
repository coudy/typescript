////[bin/0.js]
// my class comments
var MyClass = (function () {
    function MyClass() { }
    MyClass.prototype.Count = // my function comments
    function () {
        return 42;
    };
    MyClass.prototype.SetCount = function (value) {
    };
    return MyClass;
})();
//@ sourceMappingURL=0.js.map
////[bin/0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["MyClass","MyClass.constructor","MyClass.Count","MyClass.SetCount"],"mappings":"AACA,oBAAoB;AACpB;IAAAA;AAYCA,IATGA,0BADAA,uBAAuBA;IACvBA;QAEIE,OAAOA,EAAEA;AAACA,IACdA,CAACA;IAEDF,6BAAAA,UAAgBA,KAAaA;IAG7BG,CAACA;IACLH;AAACA,CAAAA,IAAA"}
////[bin/comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[bin/comments_ExternalModules_0.js.map]
{"version":3,"file":"comments_ExternalModules_0.js","sources":["comments_ExternalModules_0.ts"],"names":[],"mappings":""}
////[bin/comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[bin/comments_ExternalModules_1.js.map]
{"version":3,"file":"comments_ExternalModules_1.js","sources":["comments_ExternalModules_1.ts"],"names":[],"mappings":""}
////[bin/comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[bin/comments_MultiModule_MultiFile_0.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_0.js","sources":["comments_MultiModule_MultiFile_0.ts"],"names":[],"mappings":""}
////[bin/comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[bin/comments_MultiModule_MultiFile_1.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_1.js","sources":["comments_MultiModule_MultiFile_1.ts"],"names":[],"mappings":""}
////[bin/deprecatedBool_0.js]
//@ sourceMappingURL=deprecatedBool_0.js.map
////[bin/deprecatedBool_0.js.map]
{"version":3,"file":"deprecatedBool_0.js","sources":["deprecatedBool_0.ts"],"names":[],"mappings":""}
////[bin/deprecatedBool_1.js]
//@ sourceMappingURL=deprecatedBool_1.js.map
////[bin/deprecatedBool_1.js.map]
{"version":3,"file":"deprecatedBool_1.js","sources":["deprecatedBool_1.ts"],"names":[],"mappings":""}
////[bin/duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js.map
////[bin/duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js.map]
{"version":3,"file":"duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js","sources":["duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.ts"],"names":[],"mappings":""}
////[bin/duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js.map
////[bin/duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js.map]
{"version":3,"file":"duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js","sources":["duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.ts"],"names":[],"mappings":""}
////[bin/importInsideModule_file1.js]
//@ sourceMappingURL=importInsideModule_file1.js.map
////[bin/importInsideModule_file1.js.map]
{"version":3,"file":"importInsideModule_file1.js","sources":["importInsideModule_file1.ts"],"names":[],"mappings":""}
////[bin/importInsideModule_file2.js]
//@ sourceMappingURL=importInsideModule_file2.js.map
////[bin/importInsideModule_file2.js.map]
{"version":3,"file":"importInsideModule_file2.js","sources":["importInsideModule_file2.ts"],"names":[],"mappings":""}
////[bin/0.d.ts]
declare class MyClass {
    public Count(): number;
    public SetCount(value: number): void;
}