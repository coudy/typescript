{"version":3,"file":"recursiveClassReferenceTest.js","sourceRoot":"","sources":["recursiveClassReferenceTest.ts"],"names":["Sample","Sample.Actions","Sample.Actions.Thing","Sample.Actions.Thing.Find","Sample.Actions.Thing.Find.StartFindAction","Sample.Actions.Thing.Find.StartFindAction.constructor","Sample.Actions.Thing.Find.StartFindAction.getId","Sample.Actions.Thing.Find.StartFindAction.run","Sample.Thing","Sample.Thing.Widgets","Sample.Thing.Widgets.FindWidget","Sample.Thing.Widgets.FindWidget.constructor","Sample.Thing.Widgets.FindWidget.gar","Sample.Thing.Widgets.FindWidget.getDomNode","Sample.Thing.Widgets.FindWidget.destroy","AbstractMode","AbstractMode.constructor","AbstractMode.getInitialState","Sample.Thing.Languages","Sample.Thing.Languages.PlainText","Sample.Thing.Languages.PlainText.State","Sample.Thing.Languages.PlainText.State.constructor","Sample.Thing.Languages.PlainText.State.clone","Sample.Thing.Languages.PlainText.State.equals","Sample.Thing.Languages.PlainText.State.getMode","Sample.Thing.Languages.PlainText.Mode","Sample.Thing.Languages.PlainText.Mode.constructor","Sample.Thing.Languages.PlainText.Mode.getInitialState"],"mappings":";;;;;;AA+BA,IAAO,MAAM;AAUZ,CAVD,UAAO,MAAM;KAAbA,UAAcA,OAAOA;SAArBC,UAAsBA,KAAKA;aAA3BC,UAA4BA,IAAIA;gBAC/BC;oBAAAC;;AAQCA,oBANAA,kCAAAA;wBAAiBE,OAAOA,IAAIA;oBAAEA,CAACA;;oBAE/BF,gCAAAA,UAAWA,KAA6BA;wBAEvCG,OAAOA,IAAIA;oBACZA,CAACA;oBACFH,uBAACA;gBAADA,CAACA,IAAAD;gBARDA,uCAQCA;YACFA,CAACA,mCAAAD;kCAAAA;QAADA,CAACA,yCAAAD;kCAAAA;IAADA,CAACA,2CAAAD;iCAAAA;AAADA,CAACA,2BAAA;;AAED,IAAO,MAAM;AAoBZ,CApBD,UAAO,MAAM;KAAbA,UAAcA,KAAKA;SAAnBQ,UAAoBA,OAAOA;YAC1BC;gBAKCC,oBAAYA,SAA0CA;oBAA1CC,cAAiBA,GAATA,SAASA;AAAyBA,oBADtDA,KAAQA,OAAOA,GAAOA,IAAIA,CAACA;oBAEvBA,aAAaA;oBACbA,SAASA,CAACA,SAASA,CAACA,WAAWA,EAAEA,IAAIA,CAACA;gBAC1CA,CAACA;gBANDD,2BAAAA,UAAWA,MAAyCA;oBAAIE,IAAIA,IAAIA,CAAEA;wBAACA,OAAOA,MAAMA,CAACA,IAAIA,CAACA;qBAAEA;gBAAAA,CAACA;;gBAQzFF,kCAAAA;oBACCG,OAAOA,OAAOA;gBACfA,CAACA;;gBAEDH,+BAAAA;gBAEAI,CAACA;gBAEFJ,kBAACA;YAADA,CAACA,IAAAD;YAlBDA,gCAkBCA;QACFA,CAACA,yCAAAD;oCAAAA;IAADA,CAACA,uCAAAR;6BAAAA;AAADA,CAACA,2BAAA;;AAGD;IAAAe;;AAAwFA,IAAlDA,yCAAAA;QAAmCE,OAAOA,IAAIA;IAACA,CAACA;IAACF,oBAACA;AAADA,CAACA,IAAA;;AASxF,IAAO,MAAM;AAwBZ,CAxBD,UAAO,MAAM;KAAbf,UAAcA,KAAKA;SAAnBQ,UAAoBA,SAASA;aAA7BU,UAA8BA,SAASA;gBAEtCC;oBACOC,eAAYA,IAAmBA;wBAAnBC,SAAYA,GAAJA,IAAIA;AAAOA,oBAAIA,CAACA;oBAC1CD,wBAAAA;wBACCE,OAAOA,IAAIA;oBACZA,CAACA;;oBAEDF,yBAAAA,UAAcA,KAAYA;wBACzBG,OAAOA,IAAIA,KAAKA,KAAKA;oBACtBA,CAACA;;oBAEDH,0BAAAA;wBAA0BI,OAAOA,IAAIA;oBAAEA,CAACA;oBACzCJ,aAACA;gBAADA,CAACA,IAAAD;gBAXDA,wBAWCA;;gBAEDA;;oBAAAM;;;AAQCA,oBALAA,aADaA;qDACbA;wBACCE,OAAOA,IAAIA,KAAKA,CAACA,IAAIA,CAACA;oBACvBA,CAACA;oBAGFF,YAACA;gBAADA,CAACA,EARyBN,YAAYA,EAQrCA;gBARDA,sBAQCA;YACFA,CAACA,qDAAAD;gDAAAA;QAADA,CAACA,6CAAAV;wCAAAA;IAADA,CAACA,uCAAAR;6BAAAA;AAADA,CAACA,2BAAA"}
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
                    function StartFindAction() {
                    }
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
                    // scenario 1
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
    function AbstractMode() {
    }
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
                    // scenario 2
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
//# sourceMappingURL=recursiveClassReferenceTest.js.map
