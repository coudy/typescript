var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = (function () {
    function Base() {
    }
    return Base;
})();
var Derived = (function (_super) {
    __extends(Derived, _super);
    function Derived() {
        _super.apply(this, arguments);
    }
    return Derived;
})(Base);

<<<<<<< HEAD:tests/baselines/reference/baseIndexSignatureResolution.commonjs.js


var x = null;
var y = x[0];
=======
var Baz = (function () {
    function Baz() {
    }
    return Baz;
})();
>>>>>>> Update baselines for new compiler baseline improvements:tests/baselines/reference/declFileGenericClassWithGenericExtendedClass.js
