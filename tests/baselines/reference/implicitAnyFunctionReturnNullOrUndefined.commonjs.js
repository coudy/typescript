function nullWidenFunction() {
    return null;
}
function undefinedWidenFunction() {
    return undefined;
}

var C = (function () {
    function C() {
    }
    C.prototype.nullWidenFuncOfC = function () {
        return null;
    };

    C.prototype.underfinedWidenFuncOfC = function () {
        return undefined;
    };
    return C;
})();

function foo1() {
    return null;
}
function bar1() {
    return undefined;
}
function fooBar() {
    return 1;
}
function fooFoo() {
    return 5;
}

nullWidenFunction();
undefinedWidenFunction();
