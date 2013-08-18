// Import this module when test harness supports external modules. Also remove the internal module below.
// import Foo = require("interfaceDeclaration5")
var Foo;
(function (Foo) {
    var C1 = (function () {
        function C1() {
        }
        return C1;
    })();
    Foo.C1 = C1;
})(Foo || (Foo = {}));

var C1 = (function () {
    function C1() {
    }
    return C1;
})();

// Allowed


// Negative Case


// Err - not implemented item
var C2 = (function () {
    function C2() {
    }
    return C2;
})();

// Negative case


var C3 = (function () {
    function C3() {
    }
    return C3;
})();

// Negative case

I1;
 {
}
