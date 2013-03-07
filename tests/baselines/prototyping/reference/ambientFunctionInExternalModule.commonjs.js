////[strings.js]
var exports;
function format(value) {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        args[_i] = arguments[_i + 1];
    }
    return "";
}
exports.format = format;
exports.bind = format;
////[test.js]
var strings = require('./strings')
strings.bind('Provider returned error: {0}', 30);