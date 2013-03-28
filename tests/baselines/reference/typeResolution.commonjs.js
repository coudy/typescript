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