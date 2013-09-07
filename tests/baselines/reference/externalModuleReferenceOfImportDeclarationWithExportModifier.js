//// [externalModuleReferenceOfImportDeclarationWithExportModifier_0.js]
define(["require", "exports"], function(require, exports) {
    function foo() {
    }
    exports.foo = foo;
    ;
});
//// [externalModuleReferenceOfImportDeclarationWithExportModifier_1.js]
define(["require", "exports", 'externalModuleReferenceOfImportDeclarationWithExportModifier_0'], function(require, exports, file1) {
    exports.file1 = file1;
    exports.file1.foo();
});
