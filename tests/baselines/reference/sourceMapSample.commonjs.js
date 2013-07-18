{"version":3,"file":"sourceMapSample.js","sourceRoot":"Z:/","sources":["sourceMapSample.ts"],"names":["Foo","Foo.Bar","Foo.Bar.Greeter","Foo.Bar.Greeter.constructor","Foo.Bar.Greeter.greet","Foo.Bar.foo","Foo.Bar.foo2"],"mappings":"AAAA,IAAO,GAAG;AAkCT,CAlCD,UAAO,GAAG;KAAVA,UAAWA,GAAGA;QACVC,YAAYA,CAACA;;QAEbA;YACIC,iBAAYA,QAAuBA;gBAAvBC,aAAeA,GAARA,QAAQA;AAAQA,YACnCA,CAACA;YAEDD,0BAAAA;gBACIE,OAAOA,MAAMA,GAAGA,IAAIA,CAACA,QAAQA,GAAGA,OAAOA,CAACA;YAC5CA,CAACA;YACLF;AAACA,QAADA,CAACA,IAAAD;;QAGDA,SAASA,GAAGA,CAACA,QAAgBA;YACzBI,OAAOA,IAAIA,OAAOA,CAACA,QAAQA,CAACA,CAACA;QACjCA,CAACA;;QAEDJ,IAAIA,OAAOA,GAAGA,IAAIA,OAAOA,CAACA,eAAeA,CAACA,CAACA;QAC3CA,IAAIA,GAAGA,GAAGA,OAAOA,CAACA,KAAKA,CAACA,CAACA,CAACA;;QAE1BA,SAASA,IAAIA,CAACA,QAAgBA;YAAEK,IAAGA,aAAaA;AAAUA,iBAA1BA,WAA0BA,CAA1BA,2BAA0BA,EAA1BA,IAA0BA;gBAA1BA,sCAA0BA;;YACtDA,IAAIA,QAAQA,GAAcA,EAAEA,CAACA;YAC7BA,QAAQA,CAACA,CAACA,CAACA,GAAGA,IAAIA,OAAOA,CAACA,QAAQA,CAACA,CAACA;YACpCA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,aAAaA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;gBAC3CA,QAAQA,CAACA,IAAIA,CAACA,IAAIA,OAAOA,CAACA,aAAaA,CAACA,CAACA,CAACA,CAACA,CAACA,CAACA;aAChDA;;YAEDA,OAAOA,QAAQA,CAACA;QACpBA,CAACA;;QAEDL,IAAIA,CAACA,GAAGA,IAAIA,CAACA,OAAOA,EAAEA,OAAOA,EAAEA,GAAGA,CAACA,CAACA;QACpCA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,CAACA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;YAC/BA,CAACA,CAACA,CAACA,CAACA,CAACA,KAAKA,CAACA,CAACA,CAACA;SAChBA;IACLA,CAACA,6BAAAD;sBAAAA;AAADA,CAACA,qBAAA"}
var Foo;
(function (Foo) {
    (function (Bar) {
        "use strict";

        var Greeter = (function () {
            function Greeter(greeting) {
                this.greeting = greeting;
            }
            Greeter.prototype.greet = function () {
                return "<h1>" + this.greeting + "</h1>";
            };
            return Greeter;
        })();

        function foo(greeting) {
            return new Greeter(greeting);
        }

        var greeter = new Greeter("Hello, world!");
        var str = greeter.greet();

        function foo2(greeting) {
            var restGreetings = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                restGreetings[_i] = arguments[_i + 1];
            }
            var greeters = [];
            greeters[0] = new Greeter(greeting);
            for (var i = 0; i < restGreetings.length; i++) {
                greeters.push(new Greeter(restGreetings[i]));
            }

            return greeters;
        }

        var b = foo2("Hello", "World", "!");
        for (var j = 0; j < b.length; j++) {
            b[j].greet();
        }
    })(Foo.Bar || (Foo.Bar = {}));
    var Bar = Foo.Bar;
})(Foo || (Foo = {}));
//# sourceMappingURL=sourceMapSample.js.map
