var Shape = (function () {
    function Shape() { }
    Shape.create = function create() {
        return new Shape();
    };
    return Shape;
})();
var x = Shape;