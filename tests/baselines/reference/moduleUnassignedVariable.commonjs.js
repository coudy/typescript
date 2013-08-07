// Bug 755706: Invalid codegen when returning an unassiged variable from function in module
var Bar;
(function (Bar) {
    Bar.a = 1;
    function fooA() {
        return Bar.a;
    }

    Bar.b;
    function fooB() {
        return b;
    }
})(Bar || (Bar = {}));
