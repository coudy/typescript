{"version":3,"file":"sourceMapValidationClasses.js","sourceRoot":"","sources":["sourceMapValidationClasses.ts"],"names":["Foo","Foo.Bar","Foo.Bar.Greeter","Foo.Bar.Greeter.constructor","Foo.Bar.Greeter.greet","Foo.Bar.foo","Foo.Bar.foo2"],"mappings":"AAAA,IAAO,GAAG;AAmCT,CAnCD,UAAO,GAAG;KAAVA,UAAWA,GAAGA;QACVC,YAAYA;;QAEZA;YACIC,iBAAYA,QAAuBA;gBAAvBC,aAAeA,GAARA,QAAQA;AAAQA,YACnCA,CAACA;YAEDD,0BAAAA;gBACIE,OAAOA,MAAMA,GAAGA,IAAIA,CAACA,QAAQA,GAAGA,OAAOA;YAC3CA,CAACA;YACLF,eAACA;QAADA,CAACA,IAAAD;;QAGDA,SAASA,GAAGA,CAACA,QAAgBA;YACzBI,OAAOA,IAAIA,OAAOA,CAACA,QAAQA,CAACA;QAChCA,CAACA;;QAEDJ,IAAIA,OAAOA,GAAGA,IAAIA,OAAOA,CAACA,eAAeA,CAACA;QAC1CA,IAAIA,GAAGA,GAAGA,OAAOA,CAACA,KAAKA,CAACA,CAACA;;QAEzBA,SAASA,IAAIA,CAACA,QAAgBA;YAAEK,IAAGA,aAAaA;AAA8BA,iBAA9CA,WAA8CA,CAA9CA,2BAA8CA,EAA9CA,IAA8CA;gBAA9CA,sCAA8CA;;YAC1EA,IAAIA,QAAQA,GAAcA,EAAEA;YAC5BA,QAAQA,CAACA,CAACA,CAACA,GAAGA,IAAIA,OAAOA,CAACA,QAAQA,CAACA;YACnCA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,aAAaA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;gBAC3CA,QAAQA,CAACA,IAAIA,CAACA,IAAIA,OAAOA,CAACA,aAAaA,CAACA,CAACA,CAACA,CAACA,CAACA;aAC/CA;;YAEDA,OAAOA,QAAQA;QACnBA,CAACA;;QAEDL,IAAIA,CAACA,GAAGA,IAAIA,CAACA,OAAOA,EAAEA,OAAOA,EAAEA,GAAGA,CAACA;;QAEnCA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,CAACA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;YAC/BA,CAACA,CAACA,CAACA,CAACA,CAACA,KAAKA,CAACA,CAACA;SACfA;IACLA,CAACA,6BAAAD;sBAAAA;AAADA,CAACA,qBAAA"}
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
//# sourceMappingURL=sourceMapValidationClasses.js.map
