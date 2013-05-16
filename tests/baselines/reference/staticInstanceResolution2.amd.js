define(["require", "exports", 'winjs'], function(require, exports, __WinJS__) {
    var WinJS = __WinJS__;

    var A = (function () {
        function A() {
        }
        return A;
    })();
    A.hasOwnProperty('foo');

    var B = (function () {
        function B() {
        }
        return B;
    })();
    B.hasOwnProperty('foo');

    WinJS.Promise.timeout(10);
});
