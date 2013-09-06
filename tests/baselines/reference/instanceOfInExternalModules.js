//// [instanceOfInExternalModules_require.js]
//// [instanceOfInExternalModules_1.js]
define(["require", "exports", "FS"], function(require, exports, __Bar__) {
    ///<reference path='instanceOfInExternalModules_require.ts'/>
    var Bar = __Bar__;
    function IsFoo(value) {
        return value instanceof Bar.Foo;
    }
});
