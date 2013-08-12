define(["require", "exports"], function(require, exports) {
    
    var Foo = (function () {
        function Foo(a) {
            this.a = a;
        }
        return Foo;
    })();
    return Foo;
});

define(["require", "exports", "privacyCheckExternalModuleExportAssignmentOfGenericClass_0"], function(require, exports, __Foo__) {
    var Foo = __Foo__;
    
});
