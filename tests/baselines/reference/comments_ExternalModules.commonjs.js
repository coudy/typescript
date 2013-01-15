////[comments_ExternalModules_0.js]
/** Module comment*/
(function (m1) {
    /** b's comment*/
    m1.b;
    /** foo's comment*/
    function foo() {
        return m1.b;
    }
    /** m2 comments*/
    (function (m2) {
        /** class comment;*/
        var c = (function () {
            function c() { }
            return c;
        })();
        m2.c = c;        
        ;
        /** i*/
        m2.i = new c();
    })(m1.m2 || (m1.m2 = {}));
    var m2 = m1.m2;
    /** exported function*/
    function fooExport() {
        return foo();
    }
    m1.fooExport = fooExport;
})(exports.m1 || (exports.m1 = {}));
var m1 = exports.m1;
m1.fooExport();
var myvar = new m1.m2.c();
////[comments_ExternalModules_1.js]
/**This is on import declaration*/
var extMod = require("./comments_ExternalModules_0")
extMod.m1.fooExport();
exports.newVar = new extMod.m1.m2.c();
////[comments_ExternalModules_0.d.ts]
/** Module comment*/
export module m1 {
    /** b's comment*/
    var b: number;
    /** m2 comments*/
    module m2 {
        /** class comment;*/
        class c {
        }
        /** i*/
        var i: c;
    }
    /** exported function*/
    function fooExport(): number;
}
////[comments_ExternalModules_1.d.ts]
/**This is on import declaration*/
import extMod = module ("comments_ExternalModules_0");
export var newVar: extMod.m1.m2.c;