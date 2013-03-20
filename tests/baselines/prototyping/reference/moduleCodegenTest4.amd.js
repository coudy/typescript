define(["require", "exports"], function(require, exports) {
    (function (Baz) {
        Baz.x = "hello";
    })(0.Baz || (0.Baz = {}));
    var Baz = 0.Baz;
    Baz.x = "goodbye";
    void 0;
})