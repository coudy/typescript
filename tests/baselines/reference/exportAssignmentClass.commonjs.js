var C = (function () {
    function C() {
        this.p = 0;
    }
    return C;
})();


module.exports = C;


var D = require("./exportAssignmentClass_A");

var d = new D();
var x = d.p;

