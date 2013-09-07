//// [moduleAliasAsFunctionArgument_0.js]
//// [moduleAliasAsFunctionArgument_1.js]
define(["require", "exports", 'aMod'], function(require, exports, a) {
    

    function fn(arg) {
    }

    a.x;
    fn(a);
});
