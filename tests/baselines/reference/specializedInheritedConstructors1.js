var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var View = (function () {
    function View(options) {
    }
    return View;
})();

var Model = (function () {
    function Model() {
    }
    return Model;
})();
var MyView = (function (_super) {
    __extends(MyView, _super);
    function MyView() {
        _super.apply(this, arguments);
    }
    return MyView;
})(View);

var m = { model: new Model() };
var aView = new View({ model: new Model() });
var aView2 = new View(m);
var myView = new MyView(m);
