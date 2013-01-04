// @target: ES5
// @declaration: true
// @comments: true
/// This is class c2 without constuctor
var c2 = (function () {
    function c2() { }
    return c2;
})();
var i2 = new c2();
var i2_c = c2;
var c3 = (function () {
    /// Constructor comment
    function c3() {
    }
    return c3;
})();
var i3 = new c3();
var i3_c = c3;
/// Class comment
var c4 = (function () {
    /// Constructor comment
    function c4() {
    }
    return c4;
})();
var i4 = new c4();
var i4_c = c4;
/// Class with statics
var c5 = (function () {
    function c5() { }
    c5.s1 = 0;
    return c5;
})();
var i5 = new c5();
var i5_c = c5;
/// class with statics and constructor
var c6 = (function () {
    /// constructor comment
    function c6() {
    }
    c6.s1 = 0;
    return c6;
})();
var i6 = new c6();
var i6_c = c6;
////[0.d.ts]
/// This is class c2 without constuctor
class c2 {
}
var i2: c2;
var i2_c: new() => c2;
class c3 {
    /// Constructor comment
    constructor();
}
var i3: c3;
var i3_c: new() => c3;
/// Class comment
class c4 {
    /// Constructor comment
    constructor();
}
var i4: c4;
var i4_c: new() => c4;
/// Class with statics
class c5 {
    static s1: number;
}
var i5: c5;
var i5_c: {
    s1: number;
    new(): c5;
};
/// class with statics and constructor
class c6 {
    /// s1 comment
    static s1: number;
    /// constructor comment
    constructor();
}
var i6: c6;
var i6_c: {
    s1: number;
    new(): c6;
};