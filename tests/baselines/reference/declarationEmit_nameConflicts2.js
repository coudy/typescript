//// [declarationEmit_nameConflicts2.js]
var X;
(function (X) {
    (function (Y) {
        (function (base) {
            function f() {
            }
            base.f = f;
            var C = (function () {
                function C() {
                }
                return C;
            })();
            base.C = C;
            (function (M) {
                M.v;
            })(base.M || (base.M = {}));
            var M = base.M;
            (function (E) {
            })(base.E || (base.E = {}));
            var E = base.E;
        })(Y.base || (Y.base = {}));
        var base = Y.base;
    })(X.Y || (X.Y = {}));
    var Y = X.Y;
})(X || (X = {}));

var X;
(function (X) {
    (function (Y) {
        (function (base) {
            (function (Z) {
                // Bug 887180
                Z.f = X.Y.base.f;
                Z.C = X.Y.base.C;
                Z.M = X.Y.base.M;
                Z.E = X.Y.base.E;
            })(base.Z || (base.Z = {}));
            var Z = base.Z;
        })(Y.base || (Y.base = {}));
        var base = Y.base;
    })(X.Y || (X.Y = {}));
    var Y = X.Y;
})(X || (X = {}));


////[declarationEmit_nameConflicts2.d.ts]
declare module X.Y.base {
    function f(): void;
    class C {
    }
    module M {
        var v: any;
    }
    enum E {
    }
}
declare module X.Y.base.Z {
    var f: typeof f;
    var C: typeof C;
    var M: typeof M;
    var E: typeof E;
}
