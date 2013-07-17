define(["require", "exports"], function(require, exports) {
    function foo() {
        return 0;
    }

    
    return foo;
});

define(["require", "exports", "exportAssignmentFunction_A"], function(require, exports, __fooFunc__) {
    var fooFunc = __fooFunc__;

    var n = fooFunc();
});
