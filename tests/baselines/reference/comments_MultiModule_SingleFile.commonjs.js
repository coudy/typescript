// @target: ES5
// @declaration: true
// @comments: true
/** this is multi declare module*/
var multiM;
(function (multiM) {
    /** class b*/
    var b = (function () {
        function b() { }
        return b;
    })();
    multiM.b = b;    
})(multiM || (multiM = {}));
/** thi is multi module 2*/
var multiM;
(function (multiM) {
    /** class c comment*/
    var c = (function () {
        function c() { }
        return c;
    })();
    multiM.c = c;    
})(multiM || (multiM = {}));
new multiM.b();
new multiM.c();
////[0.d.ts]
/** this is multi declare module*/
module multiM {
    /** class b*/
    class b {
    }
}
/** thi is multi module 2*/
module multiM {
    /** class c comment*/
    class c {
    }
}