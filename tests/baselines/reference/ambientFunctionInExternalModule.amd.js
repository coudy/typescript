////[strings.js]
define(["require", "exports"], function(require, exports) {
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
})
////[test.js]
define(["require", "exports", 'strings'], function(require, exports, __strings__) {
    var strings = __strings__;

    strings.bind('Provider returned error: {0}', 30);
})