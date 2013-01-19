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
            var greeters = new Array();
            greeters[0] = new Greeter(greeting);
            for(var i = 0; i < restGreetings.length; i++) {
                greeters.push(new Greeter(restGreetings[i]));
            }
            return greeters;
        }
        var b = foo2("Hello", "World", "!");
        for(var j = 0; j < b.length; j++) {
            b[j].greet();
        }
    })(Foo.Bar || (Foo.Bar = {}));
    var Bar = Foo.Bar;
})(Foo || (Foo = {}));
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["Foo","Foo.Bar","Foo.Bar.Greeter","Foo.Bar.Greeter.constructor","Foo.Bar.Greeter.greet","Foo.Bar.foo","Foo.Bar.foo2"],"mappings":"AAAA,IAAO,GAAG;AAkCT,CAlCD,UAAO,GAAG;KAAHA,UAAIA,GAAGA;QACVC,YAAaA;QAEbA;YACIC,SADEA,OAAOA,CACGA,QAAuBA;gBAAvBC,aAAeA,GAARA,QAAQA;AAAQA,YACnCA,CAACA;YAEDD,0BAAAA;gBACIE,OAAOA,MAAMA,GAAGA,IAAIA,CAACA,QAAQA,GAAGA,OAAOA,CAACA;YAC5CA,CAACA;YACLF;AAACA,QAADA,CAACA,IAAAD,QAAAA;QAGDA,SAASA,GAAGA,CAACA,QAAgBA;YACzBI,OAAOA,IAAIA,OAAOA,CAACA,QAAQA,CAACA,CAACA;QACjCA,CAACA;QAEDJ,IAAIA,OAAOA,GAAGA,IAAIA,OAAOA,CAACA,eAAeA,CAACA,CAACA;QAC3CA,IAAIA,GAAGA,GAAGA,OAAOA,CAACA,KAAKA,EAAEA,CAACA;QAE1BA,SAASA,IAAIA,CAACA,QAAgBA;YAAEK,IAAGA,aAAaA;AAAUA,iBAA1BA,WAA0BA,CAA1BA,2BAA0BA,EAA1BA,IAA0BA;gBAA1BA,sCAA0BA;;YACtDA,IAAIA,QAAQA,GAAGA,WAAaA,CAACA;YAC7BA,QAAQA,CAACA,CAACA,CAACA,GAAGA,IAAIA,OAAOA,CAACA,QAAQA,CAACA;YACnCA,IAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,aAAaA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;gBAC3CA,QAAQA,CAACA,IAAIA,CAACA,IAAIA,OAAOA,CAACA,aAAaA,CAACA,CAACA,CAACA,CAACA,CAACA;aAC/CA;YAEDA,OAAOA,QAAQA,CAACA;QACpBA,CAACA;QAEDL,IAAIA,CAACA,GAAGA,IAAIA,CAACA,OAAOA,EAAEA,OAAOA,EAAEA,GAAGA,CAACA,CAACA;QACpCA,IAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,CAACA,CAACA,MAAMA,EAAEA,CAACA,EAAEA,CAAEA;YAC/BA,CAACA,CAACA,CAACA,CAACA,CAACA,KAAKA,EAAEA;SACfA;IACLA,CAACA,6BAAAD;IAlCMA;AAkCNA,CAAAA,qBAAA"}
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