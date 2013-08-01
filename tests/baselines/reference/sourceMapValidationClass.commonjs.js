{"version":3,"file":"sourceMapValidationClass.js","sourceRoot":"","sources":["sourceMapValidationClass.ts"],"names":["Greeter","Greeter.constructor","Greeter.greet","Greeter.fn","Greeter.get_greetings","Greeter.set_greetings"],"mappings":"AAAA;IACIA,iBAAYA,QAAuBA;QAAEC,IAAGA,CAACA;AAAUA,aAAdA,WAAcA,CAAdA,2BAAcA,EAAdA,IAAcA;YAAdA,0BAAcA;;QAAvCA,aAAeA,GAARA,QAAQA;AAAQA,QAMnCA,KAAQA,EAAEA,GAAWA,EAAEA,CAACA;IALxBA,CAACA;IACDD,0BAAAA;QACIE,OAAOA,MAAMA,GAAGA,IAAIA,CAACA,QAAQA,GAAGA,OAAOA;IAC3CA,CAACA;;IAGDF,uBAAAA;QACIG,OAAOA,IAAIA,CAACA,QAAQA;IACxBA,CAACA;IACDH;QAAAA,KAAAA;YACII,OAAOA,IAAIA,CAACA,QAAQA;QACxBA,CAACA;QACDJ,KAAAA,UAAcA,SAAiBA;YAC3BK,IAAIA,CAACA,QAAQA,GAAGA,SAASA;QAC7BA,CAACA;;;;AAHAL,IAILA,eAACA;AAADA,CAACA,IAAA"}
var Greeter = (function () {
    function Greeter(greeting) {
        var b = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            b[_i] = arguments[_i + 1];
        }
        this.greeting = greeting;
        this.x1 = 10;
    }
    Greeter.prototype.greet = function () {
        return "<h1>" + this.greeting + "</h1>";
    };

    Greeter.prototype.fn = function () {
        return this.greeting;
    };
    Object.defineProperty(Greeter.prototype, "greetings", {
        get: function () {
            return this.greeting;
        },
        set: function (greetings) {
            this.greeting = greetings;
        },
        enumerable: true,
        configurable: true
    });
    return Greeter;
})();
//# sourceMappingURL=sourceMapValidationClass.js.map
