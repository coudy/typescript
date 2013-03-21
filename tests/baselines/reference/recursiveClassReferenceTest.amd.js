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
var Sample;
(function (Sample) {
    (function (Thing) {
        (function (Widgets) {
            var FindWidget = (function () {
                function FindWidget(codeThing) {
                    this.codeThing = codeThing;
                    this.domNode = null;
                    codeThing.addWidget("addWidget", this);
                }
                FindWidget.prototype.gar = function (runner) {
                    if (true) {
                        return runner(this);
                    }
                };
                FindWidget.prototype.getDomNode = function () {
                    return domNode;
                };
                FindWidget.prototype.destroy = function () {
                };
                return FindWidget;
            })();
            Widgets.FindWidget = FindWidget;            
        })(Thing.Widgets || (Thing.Widgets = {}));
        var Widgets = Thing.Widgets;
    })(Sample.Thing || (Sample.Thing = {}));
    var Thing = Sample.Thing;
})(Sample || (Sample = {}));
var AbstractMode = (function () {
    function AbstractMode() { }
    AbstractMode.prototype.getInitialState = function () {
        return null;
    };
    return AbstractMode;
})();
var Sample;
(function (Sample) {
    (function (Thing) {
        (function (Languages) {
            (function (PlainText) {
                var State = (function () {
                    function State(mode) {
                        this.mode = mode;
                    }
                    State.prototype.clone = function () {
                        return this;
                    };
                    State.prototype.equals = function (other) {
                        return this === other;
                    };
                    State.prototype.getMode = function () {
                        return mode;
                    };
                    return State;
                })();
                PlainText.State = State;                
                var Mode = (function (_super) {
                    __extends(Mode, _super);
                    function Mode() {
                        _super.apply(this, arguments);

                    }
                    Mode.prototype.getInitialState = function () {
                        return new State(self);
                    };
                    return Mode;
                })(AbstractMode);
                PlainText.Mode = Mode;                
            })(Languages.PlainText || (Languages.PlainText = {}));
            var PlainText = Languages.PlainText;
        })(Thing.Languages || (Thing.Languages = {}));
        var Languages = Thing.Languages;
    })(Sample.Thing || (Sample.Thing = {}));
    var Thing = Sample.Thing;
})(Sample || (Sample = {}));
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["Sample","Sample.Actions","Sample.Actions.Thing","Sample.Actions.Thing.Find","Sample.Actions.Thing.Find.StartFindAction","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.getId","Sample.Actions.Thing.Find.StartFindAction.run","Sample","Sample.Thing","Sample.Thing.Widgets","Sample.Thing.Widgets.FindWidget","Sample.Thing.Widgets.FindWidget.constructor","Sample.Thing.Widgets.FindWidget.gar","Sample.Thing.Widgets.FindWidget.getDomNode","Sample.Thing.Widgets.FindWidget.destroy","AbstractMode","AbstractMode.constructor","AbstractMode.getInitialState","Sample","Sample.Thing","Sample.Thing.Languages","Sample.Thing.Languages.PlainText","Sample.Thing.Languages.PlainText.State","Sample.Thing.Languages.PlainText.State.constructor","Sample.Thing.Languages.PlainText.State.clone","Sample.Thing.Languages.PlainText.State.equals","Sample.Thing.Languages.PlainText.State.getMode","Sample.Thing.Languages.PlainText.Mode","Sample.Thing.Languages.PlainText.Mode.constructor","Sample.Thing.Languages.PlainText.Mode.getInitialState"],"mappings":";;;;;AA8BA,IACO,MAAM;AAWb,CAZA,UACO,MAAM;KADbA,UACcA,OAAOA;SADrBC,UACsBA,KAAKA;aAD3BC,UAC4BA,IAAIA;gBAChCC;oBAAAC;AASAA,oBARAA,kCAAAA;wBACmBE,OAAOA,IAAIA,CAAEA;qBAChCF;oBAAAA,gCAAAA,UACaA,KAA6BA;wBAC1CG,OACUA,IAAIA,CACdA;qBACAH;;iBARAD,IASAA;gBATAA,uCASAA,gBAAAA;YAAAA,CACAA,mCAAAD;YAZAA;AAYAA,QADAA,CACAA,yCAAAD;QAZAA;AAYAA,IADAA,CACAA,2CAAAD;IAZAA;AAYAA,CAAAA,2BAAA;AAAA,IACO,MAAM;AAqBb,CAtBA,UACO,MAAM;KADbQ,UACcA,KAAKA;SADnBC,UACoBA,OAAOA;YAC3BC;gBAKAC,SALcA,UAAUA,CAKVA,SAA0CA;oBAA1CC,cAAiBA,GAATA,SAASA;AAAyBA,oBAD9CA,KAAAA,OAAOA,GAAOA,IAAIA,CAAXA;oBAEjBA,SACeA,CAACA,SAASA,CAACA,WAAWA,EAAEA,IAAIA,CAAAA;iBAE3CD;gBARAA,2BAAAA,UACaA,MAAyCA;oBAAIE,IAAIA,IAAIA,CAAEA;wBAACA,OAAOA,MAAMA,CAACA,IAAIA,CAAAA,CAAEA;qBAACA;iBAC1FF;gBAMAA,kCAAAA;oBAEAG,OAAUA,OAAOA,CACjBA;iBACAH;gBAAAA,+BAAAA;iBAIAA;;aAjBAD,IAmBAA;YAnBAA,gCAmBAA,YAAAA;QAAAA,CACAA,yCAAAD;QAtBAA;AAsBAA,IADAA,CACAA,uCAAAD;IAtBAA;AAsBAA,CAAAA,2BAAA;AAEA;IAAAQ;AACAA,IADsCA,yCAAAA;QAAmCE,OAAOA,IAAIA,CAACA;KAAEF;;CAAvF,IACA;AAEA,IAEO,MAAM;AAyBb,CA3BA,UAEO,MAAM;KAFbG,UAEcA,KAAKA;SAFnBC,UAEoBA,SAASA;aAF7BC,UAE8BA,SAASA;gBACvCC;oBAEAC,SADcA,KAAKA,CACCA,IAAmBA;wBAAnBC,SAAYA,GAAJA,IAAIA;AAAOA,qBACvCD;oBAAAA,wBAAAA;wBACAE,OAAUA,IAAIA,CACdA;qBACAF;oBAAAA,yBAAAA,UACgBA,KAAYA;wBAC5BG,OAAUA,IAAIA,KAAKA,KAAKA,CACxBA;qBACAH;oBAAAA,0BAAAA;wBAC4BI,OAAOA,IAAIA,CAAEA;qBACzCJ;;iBAZAD,IAaAA;gBAbAA,wBAaAA,gBAAAA;gBAAAA;;oBAAAM;;;;AAUAA,oBARAA,iCAAAA;wBAGAE,OAAUA,IAAIA,KAAKA,CAACA,IAAIA,CAAAA,CACxBA;qBACAF;;iBAPAN,EAC2BA,YAAYA,EASvCA;gBAVAA,sBAUAA,gBAAAA;YAAAA,CACAA,qDAAAD;YA3BAA;AA2BAA,QADAA,CACAA,6CAAAD;QA3BAA;AA2BAA,IADAA,CACAA,uCAAAD;IA3BAA;AA2BAA,CAAAA,2BAAA"}
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