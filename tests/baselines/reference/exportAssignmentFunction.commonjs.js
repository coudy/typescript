function foo() {
    return 0;
}


module.exports = foo;


var fooFunc = require("./exportAssignmentFunction_A");

var n = fooFunc();

