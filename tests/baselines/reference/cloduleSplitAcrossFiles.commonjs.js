var D = (function () {
    function D() {
    }
    return D;
})();

var D;
(function (D) {
    D.y = "hi";
})(D || (D = {}));
D.y;
