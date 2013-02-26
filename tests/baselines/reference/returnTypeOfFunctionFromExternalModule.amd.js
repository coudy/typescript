////[test.js]
define(["require", "exports", 'system'], function(require, exports, __system__) {
    var system = __system__;

    function foo() {
        var p;
        p = system.Promise.as(10);
    }
    function bar() {
    }
})