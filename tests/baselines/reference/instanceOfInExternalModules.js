//// [instanceOfInExternalModules_require.js]
//// [instanceOfInExternalModules_1.js]
define(["require", "exports", "FS"], function(require, exports, Bar) {
    
    function IsFoo(value) {
        return value instanceof Bar.Foo;
    }
});
