define(["require", "exports"], function(require, exports) {
    (function (TopLevelModule1) {
        (function (SubModule1) {
            (function (SubSubModule1) {
                var ClassA = (function () {
                    function ClassA() { }
                    ClassA.prototype.AisIn1_1_1 = function () {
                        var a1;
                        a1.AisIn1_1_1();
                        var a2;
                        a2.AisIn1_1_1();
                        var a3;
                        a3.AisIn1_1_1();
                        var a4;
                        a4.AisIn1_1_1();
                        var b1;
                        b1.BisIn1_1_1();
                        var b2;
                        b2.BisIn1_1_1();
                        var c1;
                        c1.AisIn1_2_2();
                        var d1;
                        d1.XisIn1_1_1();
                        var d2;
                        d2.XisIn1_1_1();
                    };
                    return ClassA;
                })();
                SubSubModule1.ClassA = ClassA;                
                var ClassB = (function () {
                    function ClassB() { }
                    ClassB.prototype.BisIn1_1_1 = function () {
                        var a1;
                        a1.AisIn1_1_1();
                        var a2;
                        a2.AisIn1_1_1();
                        var a3;
                        a3.AisIn1_1_1();
                        var a4;
                        a4.AisIn1_1_1();
                        var b1;
                        b1.BisIn1_1_1();
                        var b2;
                        b2.BisIn1_1_1();
                        var c1;
                        c1.AisIn1_2_2();
                        var c2;
                        c2.AisIn2_3();
                        var d1;
                        d1.XisIn1_1_1();
                        var d2;
                        d2.XisIn1_1_1();
                    };
                    return ClassB;
                })();
                SubSubModule1.ClassB = ClassB;                
                var NonExportedClassQ = (function () {
                    function NonExportedClassQ() {
function QQ() {
                            var a4;
                            a4.AisIn1_1_1();
                            var c1;
                            c1.AisIn1_2_2();
                            var d1;
                            d1.XisIn1_1_1();
                            var c2;
                            c2.AisIn2_3();
                        }
                    }
                    return NonExportedClassQ;
                })();                
            })(SubModule1.SubSubModule1 || (SubModule1.SubSubModule1 = {}));
            var SubSubModule1 = SubModule1.SubSubModule1;
            var ClassA = (function () {
                function ClassA() {
function AA() {
                        var a2;
                        a2.AisIn1_1_1();
                        var a3;
                        a3.AisIn1_1_1();
                        var a4;
                        a4.AisIn1_1_1();
                        var d2;
                        d2.XisIn1_1_1();
                    }
                }
                return ClassA;
            })();            
        })(TopLevelModule1.SubModule1 || (TopLevelModule1.SubModule1 = {}));
        var SubModule1 = TopLevelModule1.SubModule1;
        (function (SubModule2) {
            (function (SubSubModule2) {
                var ClassA = (function () {
                    function ClassA() { }
                    ClassA.prototype.AisIn1_2_2 = function () {
                    };
                    return ClassA;
                })();
                SubSubModule2.ClassA = ClassA;                
                var ClassB = (function () {
                    function ClassB() { }
                    ClassB.prototype.BisIn1_2_2 = function () {
                    };
                    return ClassB;
                })();
                SubSubModule2.ClassB = ClassB;                
                var ClassC = (function () {
                    function ClassC() { }
                    ClassC.prototype.CisIn1_2_2 = function () {
                    };
                    return ClassC;
                })();
                SubSubModule2.ClassC = ClassC;                
            })(SubModule2.SubSubModule2 || (SubModule2.SubSubModule2 = {}));
            var SubSubModule2 = SubModule2.SubSubModule2;
        })(TopLevelModule1.SubModule2 || (TopLevelModule1.SubModule2 = {}));
        var SubModule2 = TopLevelModule1.SubModule2;
        var ClassA = (function () {
            function ClassA() { }
            ClassA.prototype.AisIn1 = function () {
            };
            return ClassA;
        })();        
        var NotExportedModule;
        (function (NotExportedModule) {
            var ClassA = (function () {
                function ClassA() { }
                return ClassA;
            })();
            NotExportedModule.ClassA = ClassA;            
        })(NotExportedModule || (NotExportedModule = {}));
    })(exports.TopLevelModule1 || (exports.TopLevelModule1 = {}));
    var TopLevelModule1 = exports.TopLevelModule1;
    var TopLevelModule2;
    (function (TopLevelModule2) {
        (function (SubModule3) {
            var ClassA = (function () {
                function ClassA() { }
                ClassA.prototype.AisIn2_3 = function () {
                };
                return ClassA;
            })();
            SubModule3.ClassA = ClassA;            
        })(TopLevelModule2.SubModule3 || (TopLevelModule2.SubModule3 = {}));
        var SubModule3 = TopLevelModule2.SubModule3;
    })(TopLevelModule2 || (TopLevelModule2 = {}));
})
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["TopLevelModule1","TopLevelModule1.SubModule1","TopLevelModule1.SubModule1.SubSubModule1","TopLevelModule1.SubModule1.SubSubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.AisIn1_1_1","TopLevelModule1.SubModule1.SubSubModule1.ClassB","TopLevelModule1.SubModule1.SubSubModule1.ClassB.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassB.BisIn1_1_1","TopLevelModule1.SubModule1.SubSubModule1.NonExportedClassQ","TopLevelModule1.SubModule1.SubSubModule1.NonExportedClassQ.constructor","TopLevelModule1.SubModule1.SubSubModule1.NonExportedClassQ.constructor.QQ","TopLevelModule1.SubModule1.ClassA","TopLevelModule1.SubModule1.ClassA.constructor","TopLevelModule1.SubModule1.ClassA.constructor.AA","TopLevelModule1.SubModule2","TopLevelModule1.SubModule2.SubSubModule2","TopLevelModule1.SubModule2.SubSubModule2.ClassA","TopLevelModule1.SubModule2.SubSubModule2.ClassA.constructor","TopLevelModule1.SubModule2.SubSubModule2.ClassA.AisIn1_2_2","TopLevelModule1.SubModule2.SubSubModule2.ClassB","TopLevelModule1.SubModule2.SubSubModule2.ClassB.constructor","TopLevelModule1.SubModule2.SubSubModule2.ClassB.BisIn1_2_2","TopLevelModule1.SubModule2.SubSubModule2.ClassC","TopLevelModule1.SubModule2.SubSubModule2.ClassC.constructor","TopLevelModule1.SubModule2.SubSubModule2.ClassC.CisIn1_2_2","TopLevelModule1.ClassA","TopLevelModule1.ClassA.constructor","TopLevelModule1.ClassA.AisIn1","TopLevelModule1.NotExportedModule","TopLevelModule1.NotExportedModule.ClassA","TopLevelModule1.NotExportedModule.ClassA.constructor","TopLevelModule2","TopLevelModule2.SubModule3","TopLevelModule2.SubModule3.ClassA","TopLevelModule2.SubModule3.ClassA.constructor","TopLevelModule2.SubModule3.ClassA.AisIn2_3"],"mappings":"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"}
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
////[deprecatedBool_0.js]
//@ sourceMappingURL=deprecatedBool_0.js.map
////[deprecatedBool_0.js.map]
{"version":3,"file":"deprecatedBool_0.js","sources":["deprecatedBool_0.ts"],"names":[],"mappings":""}
////[deprecatedBool_1.js]
//@ sourceMappingURL=deprecatedBool_1.js.map
////[deprecatedBool_1.js.map]
{"version":3,"file":"deprecatedBool_1.js","sources":["deprecatedBool_1.ts"],"names":[],"mappings":""}
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