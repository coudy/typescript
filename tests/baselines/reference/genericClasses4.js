// once caused stack overflow
var Vec2_T = (function () {
    function Vec2_T(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2_T.prototype.fmap = function (f) {
        var x = f(this.x);
        var y = f(this.y);
        var retval = new Vec2_T(x, y);
        return retval;
    };
    Vec2_T.prototype.apply = function (f) {
        var x = f.x(this.x);
        var y = f.y(this.y);
        var retval = new Vec2_T(x, y);
        return retval;
    };
    return Vec2_T;
})();
