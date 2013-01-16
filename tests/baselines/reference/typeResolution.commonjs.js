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
{"version":3,"file":"0.js","sources":["0.ts"],"names":["TopLevelModule1","TopLevelModule1.SubModule1","TopLevelModule1.SubModule1.SubSubModule1","TopLevelModule1.SubModule1.SubSubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.AisIn1_1_1","TopLevelModule1.SubModule1.SubSubModule1.ClassB","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.BisIn1_1_1","TopLevelModule1.SubModule1.SubSubModule1.NonExportedClassQ","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor.QQ","TopLevelModule1.SubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.AA","TopLevelModule1.SubModule2","TopLevelModule1.SubModule1.SubSubModule2","TopLevelModule1.SubModule1.SubSubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.AisIn1_2_2","TopLevelModule1.SubModule1.SubSubModule1.ClassB","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.BisIn1_2_2","TopLevelModule1.SubModule1.SubSubModule1.ClassC","TopLevelModule1.SubModule1.SubSubModule1.ClassA.constructor","TopLevelModule1.SubModule1.SubSubModule1.ClassA.CisIn1_2_2","TopLevelModule1.ClassA","TopLevelModule1.SubModule1.constructor","TopLevelModule1.SubModule1.AisIn1","TopLevelModule1.NotExportedModule","TopLevelModule1.SubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.constructor","TopLevelModule2","TopLevelModule1.SubModule3","TopLevelModule1.SubModule1.ClassA","TopLevelModule1.SubModule1.SubSubModule1.constructor","TopLevelModule1.SubModule1.SubSubModule1.AisIn2_3"],"mappings":"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"}