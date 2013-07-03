var foo;
(function (foo) {
    var C1 = (function () {
        function C1() {
        }
        return C1;
    })();

    var C2 = (function () {
        function C2() {
        }
        C2.prototype.test = function () {
            return true;
        };
        return C2;
    })();

    foo.e;
    foo.f;
    foo.g;
    foo.h;
})(foo || (foo = {}));

var y = foo.g;
