var A;
(function (A) {
    A.a = 10;
})(A || (A = {}));

var B;
(function (B) {
    var A = 1;
    var Y = A;
})(B || (B = {}));
