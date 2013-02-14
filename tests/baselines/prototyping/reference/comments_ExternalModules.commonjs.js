////[comments_ExternalModules_0.js]
var m1;
(function (m1) {
    m1.b;
    function foo() {
        return m1.b;
    }
    var m2;
    (function (m2) {
        var c = (function () {
            function c() { }
            return c;
        })();
        m2.c = c;        
        ;
        m2.i = new c();
    })(m2 || (m2 = {}));
    function fooExport() {
        return foo();
    }
    m1.fooExport = fooExport;
})(m1 || (m1 = {}));
m1.fooExport();
var myvar = new m1.m2.c();
var m4;
(function (m4) {
    m4.b;
    function foo() {
        return m4.b;
    }
    var m2;
    (function (m2) {
        var c = (function () {
            function c() { }
            return c;
        })();
        m2.c = c;        
        ;
        m2.i = new c();
    })(m2 || (m2 = {}));
    function fooExport() {
        return foo();
    }
    m4.fooExport = fooExport;
})(m4 || (m4 = {}));
m4.fooExport();
var myvar2 = new m4.m2.c();
////[comments_ExternalModules_1.js]
var extMod = require("./comments_ExternalModules_0")
extMod.m1.fooExport();
exports.newVar = new extMod.m1.m2.c();
extMod.m4.fooExport();
exports.newVar2 = new extMod.m4.m2.c();