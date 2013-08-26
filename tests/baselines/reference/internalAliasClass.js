//// [internalAliasClass.js]
var a;
(function (a) {
    var c = (function () {
        function c() {
        }
        return c;
    })();
    a.c = c;
})(a || (a = {}));

var c;
(function (c) {
    var b = a.c;
    c.x = new b();
})(c || (c = {}));


////[internalAliasClass.d.ts]
declare module a {
    class c {
    }
}
declare module c {
    var x: a.c;
}
