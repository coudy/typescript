var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C = (function () {
    function C() {
    }
    C.prototype.bar = function (x) {
    };
    return C;
})();

var D = (function (_super) {
    __extends(D, _super);
    function D() {
        _super.prototype..call(this);
    }
    D.prototype.bar = function () {
        _super.prototype.bar.call(this, null);
    };
    return D;
})(C);
