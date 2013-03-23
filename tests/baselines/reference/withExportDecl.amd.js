define(["require", "exports"], function(require, exports) {
    var simpleVar;
    exports.exportedSimpleVar;
    var anotherVar;
    var varWithSimpleType;
    var varWithArrayType;
    var varWithInitialValue = 30;
    exports.exportedVarWithInitialValue = 70;
    var withComplicatedValue = {
        x: 30,
        y: 70,
        desc: "position"
    };
    exports.exportedWithComplicatedValue = {
        x: 30,
        y: 70,
        desc: "position"
    };
    var arrayVar = [
        'a', 
        'b'
    ];
    exports.exportedArrayVar;
    exportedArrayVar.push({
        x: 30,
        y: 'hello world'
    });
    function simpleFunction() {
        return {
            x: "Hello",
            y: "word",
            n: 2
        };
    }
    function exportedFunction() {
        return simpleFunction();
    }
    exports.exportedFunction = exportedFunction;
    var m1;
    (function (m1) {
        function foo() {
            return "Hello";
        }
        m1.foo = foo;
    })(m1 || (m1 = {}));
    declare;
    (function (m2) {
        m2.a;
    })(0.m2 || (0.m2 = {}));
    var m2 = 0.m2;
    (function (m3) {
        function foo() {
            return m1.foo();
        }
        m3.foo = foo;
    })(0.m3 || (0.m3 = {}));
    var m3 = 0.m3;
    exports.eVar1;
    exports.eVar2 = 10;
    var eVar2;
    exports.eVar3 = 10;
    exports.eVar4;
    exports.eVar5;
})