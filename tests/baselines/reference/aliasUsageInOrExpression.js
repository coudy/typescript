//// [aliasUsageInOrExpression_backbone.js]
var Model = (function () {
    function Model() {
    }
    return Model;
})();
exports.Model = Model;
//// [aliasUsageInOrExpression_moduleA.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Backbone = require("aliasUsageInOrExpression_backbone");
var VisualizationModel = (function (_super) {
    __extends(VisualizationModel, _super);
    function VisualizationModel() {
        _super.apply(this, arguments);
    }
    return VisualizationModel;
})(Backbone.Model);
exports.VisualizationModel = VisualizationModel;
//// [aliasUsageInOrExpression_main.js]
var moduleA = require("aliasUsageInOrExpression_moduleA");

var i;
var d1 = i || moduleA;
var d2 = i || moduleA;
var d2 = moduleA || i;
var e = null || { x: moduleA };
var f = null ? { x: moduleA } : null;
