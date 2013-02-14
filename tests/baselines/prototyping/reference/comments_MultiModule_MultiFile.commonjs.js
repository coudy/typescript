////[comments_MultiModule_MultiFile_0.js]
var multiM;
(function (multiM) {
    var b = (function () {
        function b() { }
        return b;
    })();
    multiM.b = b;    
})(multiM || (multiM = {}));
var multiM;
(function (multiM) {
    var c = (function () {
        function c() { }
        return c;
    })();
    multiM.c = c;    
    var e = (function () {
        function e() { }
        return e;
    })();
    multiM.e = e;    
})(multiM || (multiM = {}));
new multiM.b();
new multiM.c();
////[comments_MultiModule_MultiFile_1.js]
var multiM;
(function (multiM) {
    var d = (function () {
        function d() { }
        return d;
    })();
    multiM.d = d;    
    var f = (function () {
        function f() { }
        return f;
    })();
    multiM.f = f;    
})(multiM || (multiM = {}));
new multiM.d();