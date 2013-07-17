{"version":3,"file":"properties.js","sourceRoot":"","sources":["file:///C:/VSClient_1_1/src/typescript/public/tests/cases/compiler/properties.ts"],"names":["MyClass","MyClass.constructor","MyClass.get_Count","MyClass.set_Count"],"mappings":"AACA;IAAAA;;AAWCA,IATGA;QAAAA,KAAAA;YAEIE,OAAOA,EAAEA,CAACA;QACdA,CAACA;QAEDF,KAAAA,UAAiBA,KAAaA;YAE1BG,EAAEA;QACNA,CAACA;;;;AALAH;IAMLA;AAACA,CAAAA,IAAA"}
var MyClass = (function () {
    function MyClass() {
    }
    Object.defineProperty(MyClass.prototype, "Count", {
        get: function () {
            return 42;
        },
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });

    return MyClass;
})();
//# sourceMappingURL=properties.js.map

////[properties.d.ts]
declare class MyClass {
    public Count : number;
}
