////[bin/0.js]
// @target: ES5
// @sourcemap: true
// @declaration: true
// @module: local
// @out: bin\
// @comments: true
// my class comments
var MyClass = (function () {
    function MyClass() { }
    MyClass.prototype.Count = // my function comments
    function () {
        return 42;
    };
    MyClass.prototype.SetCount = function (value) {
        //
            };
    return MyClass;
})();
//@ sourceMappingURL=0.js.map
////[bin/0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["MyClass","MyClass.constructor","MyClass.Count","MyClass.SetCount"],"mappings":"AAAA,eAAe;AACf,mBAAmB;AACnB,qBAAqB;AACrB,iBAAiB;AACjB,aAAa;AACb,kBAAkB;AAElB,oBAAoB;AACpB;IAAAA;AAYCA,IATGA,0BADAA,uBAAuBA;IACvBA;QAEIE,OAAOA,EAAEA,CAACA;IACdA,CAACA;IAEDF,6BAAAA,UAAgBA,KAAaA;QAEzBG,EAAEA;YACNA,CAACA;IACLH;AAACA,CAAAA,IAAA"}
////[bin/0.d.ts]
class MyClass {
    public Count(): number;
    public SetCount(value: number): void;
}