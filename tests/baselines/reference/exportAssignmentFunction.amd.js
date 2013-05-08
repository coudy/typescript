////[exportEqualsFunction_A.js]
define(["require", "exports"], function(require, exports) {
    function foo() {
        return 0;
    }

    
    return foo;
});
////[exportEqualsFunction_B.js]
define(["require", "exports"], function(require, exports) {
    

    var n = fooFunc();
});