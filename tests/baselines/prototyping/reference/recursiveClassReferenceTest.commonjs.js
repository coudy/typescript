var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sample;
(function (Sample) {
    (function (Actions) {
        (function (Thing) {
            (function (Find) {
                var StartFindAction = (function () {
                    function StartFindAction() { }
                    StartFindAction.prototype.getId = function () {
                        return "yo";
                    };
                    StartFindAction.prototype.run = function (Thing) {
                        return true;
                    };
                    return StartFindAction;
                })();
                Find.StartFindAction = StartFindAction;                
            })(Thing.Find || (Thing.Find = {}));
            var Find = Thing.Find;
        })(Actions.Thing || (Actions.Thing = {}));
        var Thing = Actions.Thing;
    })(Sample.Actions || (Sample.Actions = {}));
    var Actions = Sample.Actions;
})(Sample || (Sample = {}));
var AbstractMode = (function () {
    function AbstractMode() { }
    AbstractMode.prototype.getInitialState = function () {
        return null;
    };
    return AbstractMode;
})();
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["Sample","Sample.Actions","Sample.Actions.Thing","Sample.Actions.Thing.Find","Sample.Actions.Thing.Find.StartFindAction","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.getId","Sample.Actions.Thing.Find.StartFindAction.run","AbstractMode","AbstractMode.constructor","AbstractMode.getInitialState"],"mappings":";;;;;AA8BA,IACO,MAAM;AAWb,CAZA,UACO,MAAM;KADbA,UACcA,OAAOA;SADrBC,UACsBA,KAAKA;aAD3BC,UAC4BA,IAAIA;gBAChCC;oBAAAC;AASAA,oBARAA,kCAAAA;wBACmBE,OAAOA,IAAIA,CAAEA;qBAChCF;oBAAAA,gCAAAA,UACaA,KAA6BA;wBAC1CG,OACUA,IAAIA,CACdA;qBACAH;;iBARAD,IASAA;gBATAA,uCASAA,gBAAAA;YAAAA,CACAA,mCAAAD;YAZAA;AAYAA,QADAA,CACAA,yCAAAD;QAZAA;AAYAA,IADAA,CACAA,2CAAAD;IAZAA;AAYAA,CAAAA,2BAAA;AAwBA;IAAAQ;AACAA,IADsCA,yCAAAA;QAAmCE,OAAOA,IAAIA,CAACA;KAAEF;;CAAvF,IACA"}
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