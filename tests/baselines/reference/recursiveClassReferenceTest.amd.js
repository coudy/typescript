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
                    if(true) {
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
{"version":3,"file":"0.js","sources":["0.ts"],"names":["Sample","Sample.Actions","Sample.Actions.Thing","Sample.Actions.Thing.Find","Sample.Actions.Thing.Find.StartFindAction","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.getId","Sample.Actions.Thing.Find.StartFindAction.run","Sample","Sample.Thing","Sample.Actions.Widgets","Sample.Actions.Thing.FindWidget","Sample.Actions.Thing.Find.constructor","Sample.Actions.Thing.Find.gar","Sample.Actions.Thing.Find.getDomNode","Sample.Actions.Thing.Find.destroy","AbstractMode","Sample.constructor","Sample.getInitialState","Sample","Sample.Thing","Sample.Actions.Languages","Sample.Actions.Thing.PlainText","Sample.Actions.Thing.Find.State","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.clone","Sample.Actions.Thing.Find.StartFindAction.equals","Sample.Actions.Thing.Find.StartFindAction.getMode","Sample.Actions.Thing.Find.Mode","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.getInitialState"],"mappings":";;;;;AAoCA,IAAO,MAAM;AAUZ,CAVD,UAAO,MAAM;KAANA,UAAOA,OAAOA;SAAdC,UAAeA,KAAKA;aAApBC,UAAqBA,IAAIA;gBAC/BC;oBAAAC;AAQCA;wBANkBE,OAAAA,IAAIA,CAAAA;oBAAJA,CAAIA;oBAAAF,gCAAAA,UAEXA,KAA6BA;wBAEvCG,OAAOA,IAAIA,CAACA;oBACbA,CAACA;oBACFH;AAACA,gBAADA,CAACA,IAAAD;gBARDA,uCAQCA,gBAAAA;YACFA,CAACA,mCAAAD;YAVMA;AAUNA,QAADA,CAACA,yCAAAD;QAVMA;AAUNA,IAADA,CAACA,2CAAAD;IAVMA;AAUNA,CAAAA,2BAAA;AAED,IAAO,MAAM;AAoBZ,CApBD,UAAO,MAAM;KAANQ,UAAOA,KAAKA;SAAZC,UAAaA,OAAOA;YAC1BC;gBAKCC,SALYA,UAAUA,CAKVA,SAA0CA;oBAA1CC,cAAiBA,GAATA,SAASA;AAAyBA,oBADtDA,KAAQA,OAAOA,GAAOA,IAAIA,CAAAA;oBAGtBA,SAASA,CAACA,SAASA,CAACA,WAAWA,EAAEA,IAAIA,CAACA;gBAC1CA,CAACA;gBANDD,2BAAAA,UAAWA,MAAyCA;oBAAIE,GAAIA,IAAIA,CAACA;wBAAEA,OAAOA,MAAMA,CAACA,IAAIA,CAACA,CAACA;qBAACA;gBAAAA,CAACA;gBAQzFF,kCAAAA;oBACCG,OAAOA,OAAOA,CAACA;gBAChBA,CAACA;gBAEDH,+BAAAA;gBAEAI,CAACA;gBAEFJ;AAACA,YAADA,CAACA,IAAAD;YAlBDA,gCAkBCA,YAAAA;QACFA,CAACA,yCAAAD;QApBMA;AAoBNA,IAADA,CAACA,uCAAAD;IApBMA;AAoBNA,CAAAA,2BAAA;AAGD;IAAAQ;AAAgFA;QAANE,OAAAA,IAAIA,CAAAA;IAAJA,CAAIA;IAACF;AAACA,CAAAA,IAAA;AAKhF,IAAO,MAAM;AAwBZ,CAxBD,UAAO,MAAM;KAANG,UAAOA,KAAKA;SAAZC,UAAaA,SAASA;aAAtBC,UAAuBA,SAASA;gBAEtCC;oBACOC,SADMA,KAAKA,CACCA,IAAmBA;wBAAnBC,SAAYA,GAAJA,IAAIA;AAAOA,oBAAIA,CAACA;oBAC1CD,wBAAAA;wBACCE,OAAOA,IAAIA,CAACA;oBACbA,CAACA;oBAEDF,yBAAAA,UAAcA,KAAYA;wBACzBG,OAAOA,IAAIA,KAAKA,KAAKA,CAACA;oBACvBA,CAACA;;wBAE0BC,OAAAA,IAAIA,CAAAA;oBAAJA,CAAIA;oBAChCJ;AAACA,gBAADA,CAACA,IAAAD;gBAXDA,wBAWCA,gBAAAA;gBAEDA;;oBAAAM;;;;AAQCA,oBALAA,iCAAAA;wBACCE,OAAOA,IAAIA,KAAKA,CAACA,IAAIA,CAACA,CAACA;oBACxBA,CAACA;oBAGFF;AAACA,gBAADA,CAACA,EARyBN,YAAYA,EAQrCA;gBARDA,sBAQCA,gBAAAA;YACFA,CAACA,qDAAAD;YAxBMA;AAwBNA,QAADA,CAACA,6CAAAD;QAxBMA;AAwBNA,IAADA,CAACA,uCAAAD;IAxBMA;AAwBNA,CAAAA,2BAAA"}
////[comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingA.js.map
////[duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js]
//@ sourceMappingURL=duplicateIdentifierShouldNotShorCircuitBaseTypeBindingB.js.map
////[importInsideModule_file1.js]
//@ sourceMappingURL=importInsideModule_file1.js.map
////[importInsideModule_file2.js]
//@ sourceMappingURL=importInsideModule_file2.js.map