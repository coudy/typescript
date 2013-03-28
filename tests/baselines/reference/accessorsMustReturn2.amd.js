var M;
(function (M) {
    var C = (function () {
        function C() {
            this.x = 1;
        }
        C.prototype.pgF = function () {
        };
        Object.defineProperty(C.prototype, "pgF", {
            get: function () {
            },
            enumerable: true,
            configurable: true
        });
        return C;
    })();    
})(M || (M = {}));