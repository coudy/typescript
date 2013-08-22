//// [exportAssignmentFunction_A.js]
define(["require", "exports"], function(require, exports) {
    function foo() {
        return 0;
    }

    
    return foo;
});
//// [exportAssignmentFunction_B.js]
define(["require", "exports", "exportAssignmentFunction_A"], function(require, exports, __fooFunc__) {
    var fooFunc = __fooFunc__;

    var n = fooFunc();
});
