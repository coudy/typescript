define(["require", "exports", "module", "Test2"], function(require, exports, __mod__, __b__) {
    var mod = __mod__;
    var b = __b__;

    exports.a = function () {
        //var x = mod.id; // TODO needed hack that mod is loaded
        b.b(mod);
    };
});
