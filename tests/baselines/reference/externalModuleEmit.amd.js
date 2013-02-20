////[test.js]
define(["require", "exports", "module1", 'module2', 'module3', "module3", 'module4', "module4"], function(require, exports, __m1__, __m2__, __m3__, __m4__, __m5__, __m6__) {
    var m1 = __m1__;

    var m2 = __m2__;

        var m3 = __m3__;

    var m4 = __m4__;

        var m5 = __m5__;

    var m6 = __m6__;

    var q = 3;
    m1.q1 = q;
    m2.q2 = q;
    m3.q3 = q;
    m4.q3 = q;
    m5.q4 = q;
    m6.q4 = q;
})
////[module1.js]
define(["require", "exports"], function(require, exports) {
    exports.q1 = 3;
})
////[module2.js]
define(["require", "exports"], function(require, exports) {
    exports.q2 = 3;
})