var A;
(function (A) {
    var B;
    (function (B) {
        function createB() {
            return null;
        }
        B.createB = createB;
    })(B || (B = {}));
})(A || (A = {}));

var x = null;
