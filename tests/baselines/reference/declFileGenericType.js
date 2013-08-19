var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
(function (C) {
    var A = (function () {
        function A() {
        }
        return A;
    })();
    C.A = A;
    var B = (function () {
        function B() {
        }
        return B;
    })();
    C.B = B;

    function F(x) {
        return null;
    }
    C.F = F;
    function F2(x) {
        return null;
    }
    C.F2 = F2;
    function F3(x) {
        return null;
    }
    C.F3 = F3;
    function F4(x) {
        return null;
    }
    C.F4 = F4;

    function F5() {
        return null;
    }
    C.F5 = F5;

    function F6(x) {
        return null;
    }
    C.F6 = F6;

    var D = (function () {
        function D(val) {
            this.val = val;
        }
        return D;
    })();
    C.D = D;
})(exports.C || (exports.C = {}));
var C = exports.C;

exports.a;

exports.b = C.F;
exports.c = C.F2;
exports.d = C.F3;
exports.e = C.F4;

exports.x = (new C.D(new C.A())).val;

function f() {
}
exports.f = f;

exports.g = C.F5();

var h = (function (_super) {
    __extends(h, _super);
    function h() {
        _super.apply(this, arguments);
    }
    return h;
})(C.A);
exports.h = h;

exports.j = C.F6;

