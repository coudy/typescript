////[comments_MultiModule_MultiFile_1.js]
var multiM;
(function (multiM) {
    /// class d comment
    var d = (function () {
        function d() { }
        return d;
    })();
    multiM.d = d;    
})(multiM || (multiM = {}));
new multiM.d();
////[comments_MultiModule_MultiFile_1.d.ts]
module multiM {
    /// class d comment
    class d {
    }
}