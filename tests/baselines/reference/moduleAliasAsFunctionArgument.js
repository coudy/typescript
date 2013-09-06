//// [moduleAliasAsFunctionArgument_0.js]
//// [moduleAliasAsFunctionArgument_1.js]
define(["require", "exports", 'aMod'], function(require, exports, __a__) {
    ///<reference path='moduleAliasAsFunctionArgument_0.ts'/>
    var a = __a__;

    function fn(arg) {
    }

    a.x;
    fn(a);
});
