var multiM;
(function (multiM) {
    /// class b
    var b = (function () {
        function b() { }
        return b;
    })();
    multiM.b = b;    
})(multiM || (multiM = {}));
var multiM;
(function (multiM) {
    /// class c comment
    var c = (function () {
        function c() { }
        return c;
    })();
    multiM.c = c;    
})(multiM || (multiM = {}));
new multiM.b();
new multiM.c();
////[0.d.ts]
module multiM {
    /// class b
    class b {
    }
}
module multiM {
    /// class c comment
    class c {
    }
}