//// [withImportDecl_0.js]
//// [withImportDecl_1.js]
define(["require", "exports", "m1"], function(require, exports, m3) {
    ///<reference path='withImportDecl_0.ts'/>
    var simpleVar;

    var anotherVar;
    var varWithSimpleType;
    var varWithArrayType;

    var varWithInitialValue = 30;

    var withComplicatedValue = { x: 30, y: 70, desc: "position" };

    var arrayVar = ['a', 'b'];

    function simpleFunction() {
        return {
            x: "Hello",
            y: "word",
            n: 2
        };
    }

    var m1;
    (function (m1) {
        function foo() {
            return "Hello";
        }
        m1.foo = foo;
    })(m1 || (m1 = {}));

    

    var b = new m3.A();
});


////[withImportDecl_0.d.ts]
declare module "m1" {
    class A {
    }
}
////[withImportDecl_1.d.ts]
/// <reference path="withImportDecl_0.d.ts" />
