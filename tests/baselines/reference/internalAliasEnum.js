var a;
(function (a) {
    (function (weekend) {
        weekend[weekend["Friday"] = 0] = "Friday";
        weekend[weekend["Saturday"] = 1] = "Saturday";
        weekend[weekend["Sunday"] = 2] = "Sunday";
    })(a.weekend || (a.weekend = {}));
    var weekend = a.weekend;
})(a || (a = {}));

var c;
(function (c) {
    var b = a.weekend;
    c.bVal = b.Sunday;
})(c || (c = {}));
