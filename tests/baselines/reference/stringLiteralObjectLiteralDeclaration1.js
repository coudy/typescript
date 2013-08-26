//// [stringLiteralObjectLiteralDeclaration1.js]
var m1;
(function (m1) {
    m1.n = { 'foo bar': 4 };
})(m1 || (m1 = {}));


////[stringLiteralObjectLiteralDeclaration1.d.ts]
declare module m1 {
    var n: {
        'foo bar': number;
    };
}
