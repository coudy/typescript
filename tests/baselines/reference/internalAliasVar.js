var a;
(function (a) {
    a.x = 10;
})(a || (a = {}));

var c;
(function (c) {
    var b = a.x;
    c.bVal = b;
})(c || (c = {}));
