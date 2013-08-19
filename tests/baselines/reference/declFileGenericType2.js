var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            var AbstractElementController = (function (_super) {
                __extends(AbstractElementController, _super);
                function AbstractElementController() {
                    _super.call(this);
                }
                return AbstractElementController;
            })(templa.mvc.AbstractController);
            mvc.AbstractElementController = AbstractElementController;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));

var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            // Module
            (function (composite) {
                var AbstractCompositeElementController = (function (_super) {
                    __extends(AbstractCompositeElementController, _super);
                    function AbstractCompositeElementController() {
                        _super.call(this);
                        this._controllers = [];
                    }
                    return AbstractCompositeElementController;
                })(templa.dom.mvc.AbstractElementController);
                composite.AbstractCompositeElementController = AbstractCompositeElementController;
            })(mvc.composite || (mvc.composite = {}));
            var composite = mvc.composite;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
