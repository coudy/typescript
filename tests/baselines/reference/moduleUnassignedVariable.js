var Bar;
(function (Bar) {
    Bar.a = 1;
    function fooA() {
        return Bar.a;
    }

    Bar.b;
    function fooB() {
        return Bar.b;
    }
})(Bar || (Bar = {}));
