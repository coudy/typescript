// bug 755711: Invalid codegen for second use of variable in module
var Bar;
(function (Bar) {
    Bar.a = 1;
    var t = undefined[Bar.a][a];
})(Bar || (Bar = {}));
