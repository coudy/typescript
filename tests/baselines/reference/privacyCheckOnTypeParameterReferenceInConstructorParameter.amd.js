define(["require", "exports"], function(require, exports) {
    var A = (function () {
        function A(callback) {
            var child = new B(this);
        }
        return A;
    })();
    exports.A = A;

    var B = (function () {
        function B(parent) {
        }
        return B;
    })();
    exports.B = B;
});
