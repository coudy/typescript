////[comments_MultiModule_MultiFile_0.js]
/** this is multi declare module*/
var multiM;
(function (multiM) {
    /// class b comment
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
    // class e comment
    var e = (function () {
        function e() { }
        return e;
    })();
    multiM.e = e;    
})(multiM || (multiM = {}));
new multiM.b();
new multiM.c();
////[comments_MultiModule_MultiFile_1.js]
/** this is multi module 3 comment*/
var multiM;
(function (multiM) {
    /** class d comment*/
    var d = (function () {
        function d() { }
        return d;
    })();
    multiM.d = d;    
    /// class f comment
    var f = (function () {
        function f() { }
        return f;
    })();
    multiM.f = f;    
})(multiM || (multiM = {}));
new multiM.d();
////[comments_MultiModule_MultiFile_0.d.ts]
/** this is multi declare module*/
module multiM {
    export class b {
    }
}
/** thi is multi module 2*/
module multiM {
    /** class c comment*/
    export class c {
    }
    export class e {
    }
}
////[comments_MultiModule_MultiFile_1.d.ts]
/** this is multi module 3 comment*/
module multiM {
    /** class d comment*/
    export class d {
    }
    export class f {
    }
}