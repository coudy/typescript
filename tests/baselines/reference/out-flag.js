//// [out-flag.js]
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
