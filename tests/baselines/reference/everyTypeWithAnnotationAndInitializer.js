var C = (function () {
    function C() {
    }
    return C;
})();

var D = (function () {
    function D() {
    }
    return D;
})();

function F(x) {
    return 42;
}

var M;
(function (M) {
    var A = (function () {
        function A() {
        }
        return A;
    })();
    M.A = A;

    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M || (M = {}));

var aNumber = 9.9;
var aString = 'this is a string';
var aDate = new Date(12);
var anObject = new Object();

var anAny = null;
var aSecondAny = undefined;
var aVoid = undefined;

var anInterface = new C();
var aClass = new C();
var aGenericClass = new D();
var anObjectLiteral = { id: 12 };
var anOtherObjectLiteral = new C();

var aFunction = F;
var anOtherFunction = F;
var aLambda = function (x) {
    return 2;
};

var aModule = M;
var aClassInModule = new M.A();
var aFunctionInModule = function (x) {
    return 'this is a string';
};
