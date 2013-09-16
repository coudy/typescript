//// [constructorTypeWithTypeParameters.js]
var anotherVar;


////[constructorTypeWithTypeParameters.d.ts]
declare var X: new<T>() => number;
declare var Y: new() => number;
declare var anotherVar: new<T>() => number;
