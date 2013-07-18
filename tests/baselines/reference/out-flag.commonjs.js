{"version":3,"file":"out-flag.js","sourceRoot":"","sources":["out-flag.ts"],"names":["MyClass","MyClass.constructor","MyClass.Count","MyClass.SetCount"],"mappings":"AAAA,eAAe;AAEf,oBAAoB;AACpB;IAAAA;;AAYCA,IATGA,uBADuBA;8BACvBA;QAEIE,OAAOA,EAAEA,CAACA;IACdA,CAACA;;IAEDF,6BAAAA,UAAgBA,KAAaA;QAEzBG,EAAEA;IACNA,CAACA;IACLH;AAACA,CAAAA,IAAA"}
//// @out: bin\
// my class comments
var MyClass = (function () {
    function MyClass() {
    }
    // my function comments
    MyClass.prototype.Count = function () {
        return 42;
    };

    MyClass.prototype.SetCount = function (value) {
        //
    };
    return MyClass;
})();
//# sourceMappingURL=out-flag.js.map

////[out-flag.d.ts]
declare class MyClass {
    public Count(): number;
    public SetCount(value: number): void;
}
