define(["require", "exports"], function(require, exports) {
    /** this is multi declare module*/
    (function (multiM) {
        /// class b comment
        var b = (function () {
            function b() {
            }
            return b;
        })();
        multiM.b = b;
    })(exports.multiM || (exports.multiM = {}));
    var multiM = exports.multiM;

    /** thi is multi module 2*/
    var multiM;
    (function (multiM) {
        /** class c comment*/
        var c = (function () {
            function c() {
            }
            return c;
        })();
        multiM.c = c;

        // class e comment
        var e = (function () {
            function e() {
            }
            return e;
        })();
        multiM.e = e;
    })(multiM || (multiM = {}));

    new multiM.b();
    new multiM.c();
});
