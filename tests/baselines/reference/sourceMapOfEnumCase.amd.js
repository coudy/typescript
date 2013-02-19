var EnumNumbers;
(function (EnumNumbers) {
    EnumNumbers._map = [];
    EnumNumbers.one = 1;
    EnumNumbers._map[2] = "two";
    EnumNumbers.two = 2;
    EnumNumbers._map[3] = "three";
    EnumNumbers.three = 3;
    EnumNumbers.ten = 10;
})(EnumNumbers || (EnumNumbers = {}));
function foo(a) {
    switch(a.a) {
        case EnumNumbers.one:
            WScript.Echo(a);
            break;
        case EnumNumbers.two:
            WScript.Echo("Hello this is 2");
            break;
        case EnumNumbers.three:
            WScript.Echo("This is 1");
            break;
        case EnumNumbers.ten:
            WScript.Echo("Case of 10");
        default:
            WScript.Echo("Default:" + a);
            break;
    }
}
foo({
    a: 1
});
foo({
    a: 2
});
foo({
    a: 3
});
foo({
    a: 10
});
foo({
    a: 14
});
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["EnumNumbers","foo"],"mappings":"AAAA,IAAK,WAAW;AAOf,CAPD,UAAK,WAAW;;IAGZA,YAAAA,GAAGA,GAAGA,CAACA,CAAAA;;IACPA,YAAAA,GAAGA,KAAAA;;IACHA,YAAAA,KAAKA,KAAAA;IACLA,YAAAA,GAAGA,GAAGA,EAAEA,CAAAA;AACZA,CAACA,qCAAA;AAED,SAAS,GAAG,CAAC,CAAiB;IAE1BC,OAAQA,CAACA,CAACA,CAACA,CAACA;QACRA,KAAKA,WAAWA,CAACA,GAAGA,CAACA;YACjBA,OAAOA,CAACA,IAAIA,CAACA,CAACA,CAACA;YACfA,KAAMA;AAAAA,QAEVA,KAAKA,WAAWA,CAACA,GAAGA,CAACA;YACjBA,OAAOA,CAACA,IAAIA,CAACA,iBAAiBA,CAACA;YAC/BA,KAAMA;AAAAA,QAEVA,KAAKA,WAAWA,CAACA,KAAKA,CAACA;YACnBA,OAAOA,CAACA,IAAIA,CAACA,WAAWA,CAACA;YACzBA,KAAMA;AAAAA,QAEVA,KAAKA,WAAWA,CAACA,GAAGA,CAACA;YACjBA,OAAOA,CAACA,IAAIA,CAACA,YAAYA,CAACA;AAACA,QAE/BA,OAAOA,CAACA;YACJA,OAAOA,CAACA,IAAIA,CAACA,UAAUA,GAAGA,CAACA,CAACA;YAC5BA,KAAMA;AAAAA,KACbA;AAELA,CAACA;AAED,GAAG,CAAC;IAAE,CAAC,EAAE,CAAC;CAAE,CAAC;AACb,GAAG,CAAC;IAAE,CAAC,EAAE,CAAC;CAAE,CAAC;AACb,GAAG,CAAC;IAAE,CAAC,EAAE,CAAC;CAAE,CAAC;AACb,GAAG,CAAC;IAAE,CAAC,EAAE,EAAE;CAAE,CAAC;AACd,GAAG,CAAC;IAAE,CAAC,EAAE,EAAE;CAAE,CAAC"}
////[comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[comments_ExternalModules_0.js.map]
{"version":3,"file":"comments_ExternalModules_0.js","sources":["comments_ExternalModules_0.ts"],"names":[],"mappings":""}
////[comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[comments_ExternalModules_1.js.map]
{"version":3,"file":"comments_ExternalModules_1.js","sources":["comments_ExternalModules_1.ts"],"names":[],"mappings":""}
////[comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[comments_MultiModule_MultiFile_0.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_0.js","sources":["comments_MultiModule_MultiFile_0.ts"],"names":[],"mappings":""}
////[comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[comments_MultiModule_MultiFile_1.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_1.js","sources":["comments_MultiModule_MultiFile_1.ts"],"names":[],"mappings":""}
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js.map
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js.map]
{"version":3,"file":"duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js","sources":["duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.ts"],"names":[],"mappings":""}
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js.map
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js.map]
{"version":3,"file":"duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js","sources":["duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.ts"],"names":[],"mappings":""}
////[importInsideModule_file1.js]
//@ sourceMappingURL=importInsideModule_file1.js.map
////[importInsideModule_file1.js.map]
{"version":3,"file":"importInsideModule_file1.js","sources":["importInsideModule_file1.ts"],"names":[],"mappings":""}
////[importInsideModule_file2.js]
//@ sourceMappingURL=importInsideModule_file2.js.map
////[importInsideModule_file2.js.map]
{"version":3,"file":"importInsideModule_file2.js","sources":["importInsideModule_file2.ts"],"names":[],"mappings":""}