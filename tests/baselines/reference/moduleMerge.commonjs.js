// This should not compile both B classes are in the same module this should be a collission
var A;
(function (A) {
    var B = (function () {
        function B() {
        }
        B.prototype.Hello = function () {
            return "from private B";
        };
        return B;
    })();
})(A || (A = {}));

var A;
(function (A) {
    var B = (function () {
        function B() {
        }
        B.prototype.Hello = function () {
            return "from export B";
        };
        return B;
    })();
    A.B = B;
})(A || (A = {}));
