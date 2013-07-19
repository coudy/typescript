// In second instance of same module, exported interface is not visible
var m;
(function (m) {
    var n = (function () {
        function n() {
        }
        return n;
    })();
    m.n = n;
})(m || (m = {}));
