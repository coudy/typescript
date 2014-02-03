var MyLibrary;
(function (MyLibrary) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    MyLibrary.Point = Point;
    Point.X = 0;

    Point.Y = MyLibrary.Point.X;
})(MyLibrary || (MyLibrary = {}));
var Mod2;
(function (Mod2) {
    (function (MyLibrary) {
        var Point = (function () {
            function Point() {
            }
            return Point;
        })();
        MyLibrary.Point = Point;
        Point.X = 0;
        Point.Y = MyLibrary.Point.X;

        var m = Mod2.MyLibrary.Point.X;
    })(Mod2.MyLibrary || (Mod2.MyLibrary = {}));
    var MyLibrary = Mod2.MyLibrary;
})(Mod2 || (Mod2 = {}));
