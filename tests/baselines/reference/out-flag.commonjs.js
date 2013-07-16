////[bin/0.js.map]
{"version":3,"file":"0.js","sourceRoot":"","sources":["file:///0.ts"],"names":["MyClass","MyClass.constructor","MyClass.Count","MyClass.SetCount"],"mappings":"AACA,oBAAoB;AACpB;IAAAA;;AAYCA,IATGA,uBADuBA;8BACvBA;QAEIE,OAAOA,EAAEA,CAACA;IACdA,CAACA;;IAEDF,6BAAAA,UAAgBA,KAAaA;QAEzBG,EAAEA;IACNA,CAACA;IACLH;AAACA,CAAAA,IAAA"}
////[bin/0.js]
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
//# sourceMappingURL=0.js.map

////[bin/0.d.ts]
declare class MyClass {
    public Count(): number;
    public SetCount(value: number): void;
}
