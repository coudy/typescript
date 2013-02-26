////[test.js]
var system = require('system')
function foo() {
    var p;
    p = system.Promise.as(10);
}
function bar() {
}