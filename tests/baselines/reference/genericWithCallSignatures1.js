//// [genericWithCallSignatures_0.js]
//// [genericWithCallSignatures_1.js]
///<reference path="genericWithCallSignatures_0.ts"/>
var MyClass = (function () {
    function MyClass() {
    }
    MyClass.prototype.myMethod = function () {
        var x = this.callableThing();
    };
    return MyClass;
})();
