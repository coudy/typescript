'use strict';
// static as constructor parameter name should give error if 'use strict'
var test = (function () {
    function test() {
    }
    return test;
})();
