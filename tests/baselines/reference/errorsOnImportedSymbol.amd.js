////[errorsOnImportedSymbol_0.js]
define(["require", "exports"], function(require, exports) {
    
});

////[errorsOnImportedSymbol_1.js]
define(["require", "exports", "errorsOnImportedSymbol_0"], function(require, exports, __Sammy__) {
    var Sammy = __Sammy__;
    var x = new Sammy.Sammy();
    var y = Sammy.Sammy();
});
