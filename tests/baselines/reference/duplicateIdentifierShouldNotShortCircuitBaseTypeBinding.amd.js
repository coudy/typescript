define(["require", "exports"], function(require, exports) {
    (function (Shapes) {
        var Point = (function () {
            function Point() {
            }
            return Point;
        })();
        Shapes.Point = Point;
    })(exports.Shapes || (exports.Shapes = {}));
    var Shapes = exports.Shapes;
});
