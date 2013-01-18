////[bin/a.js]
var Alpha = (function () {
    function Alpha() { }
    return Alpha;
})();
////[bin/b.js]
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Beta = (function (_super) {
    __extends(Beta, _super);
    function Beta() {
        _super.apply(this, arguments);

    }
    return Beta;
})(Alpha);
////[bin/a.d.ts]
class Alpha {
}
////[bin/b.d.ts]
class Beta extends Alpha {
}