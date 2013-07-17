var x = 1;
var M;
(function (M) {
    M.x = 2;
})(M || (M = {}));

var M;
(function (M) {
    var x = 3;
})(M || (M = {}));
