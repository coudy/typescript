{"version":3,"file":"properties.js","sourceRoot":"","sources":["properties.ts"],"names":["MyClass","MyClass.constructor","MyClass.get_Count","MyClass.set_Count"],"mappings":"AACA;IAAAA;;AAWCA,IATGA;QAAAA,KAAAA;YAEIE,OAAOA,EAAEA;QACbA,CAACA;QAEDF,KAAAA,UAAiBA,KAAaA;YAE1BG,EAAEA;QACNA,CAACA;;;;AALAH;IAMLA,eAACA;AAADA,CAACA,IAAA"}
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
