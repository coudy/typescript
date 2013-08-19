// bug 742098: intermixing modules and interfaces causes errors at call site and order matters
var A;
(function (A) {
    (function (B) {
        function createB() {
            return null;
        }
        B.createB = createB;
    })(A.B || (A.B = {}));
    var B = A.B;
})(A || (A = {}));

var x = A.B.createB();
