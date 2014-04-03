//// [declarationEmit_nameConflicts3.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var M;
(function (M) {
    (function (D) {
        function f() {
        }
        D.f = f;
    })(M.D || (M.D = {}));
    var D = M.D;
    (function (C) {
        function f() {
        }
        C.f = f;
    })(M.C || (M.C = {}));
    var C = M.C;
    (function (E) {
        function f() {
        }
        E.f = f;
    })(M.E || (M.E = {}));
    var E = M.E;
})(M || (M = {}));

var M;
(function (M) {
    (function (P) {
        var C = (function () {
            function C() {
            }
            C.f = function () {
            };
            return C;
        })();
        P.C = C;
        var E = (function (_super) {
            __extends(E, _super);
            function E() {
                _super.apply(this, arguments);
            }
            return E;
        })(C);
        P.E = E;
        (function (D) {
            D[D["f"] = 0] = "f";
        })(P.D || (P.D = {}));
        var D = P.D;

        // Bug 887180
        P.v;
        P.w = M.D.f;
        P.x = M.C.f;
        P.x = M.E.f;
    })(M.P || (M.P = {}));
    var P = M.P;
})(M || (M = {}));


////[declarationEmit_nameConflicts3.d.ts]
declare module M {
    interface D {
    }
    module D {
        function f(): void;
    }
    module C {
        function f(): void;
    }
    module E {
        function f(): void;
    }
}
declare module M.P {
    class C {
        static f(): void;
    }
    class E extends C {
    }
    enum D {
        f = 0,
    }
    var v: M.D;
    var w: typeof D.f;
    var x: typeof C.f;
    var x: typeof E.f;
}
