define(["require", "exports"], function(require, exports) {
    var A = (function () {
        function A(callback) {
            this.callback = callback;
            var child = new B(this);
        }
        A.prototype.AAA = function (callback) {
            var child = new B(this);
        };
        return A;
    })();
    exports.A = A;

    var B = (function () {
        function B(parent) {
            this.parent = parent;
        }
        return B;
    })();
    exports.B = B;
});
