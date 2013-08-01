{"version":3,"file":"sourceMapValidationFunctions.js","sourceRoot":"","sources":["sourceMapValidationFunctions.ts"],"names":["greet","greet2","foo"],"mappings":"AAAA,IAAI,SAAS,GAAG,CAAC;AACjB,SAAS,KAAK,CAAC,QAAgB;IAC3BA,SAASA,EAAEA;IACXA,OAAOA,SAASA;AACpBA,CAACA;AACD,SAAS,MAAM,CAAC,QAAgB,EAAE,CAAM,EAAE,CAAU;IAAlBC,gCAAAA,CAACA,GAAGA,EAAEA;AAAAA,IAAcA,IAAGA,UAAUA;AAAUA,SAAvBA,WAAuBA,CAAvBA,2BAAuBA,EAAvBA,IAAuBA;QAAvBA,mCAAuBA;;IACzEA,SAASA,EAAEA;IACXA,OAAOA,SAASA;AACpBA,CAACA;AACD,SAAS,GAAG,CAAC,QAAgB,EAAE,CAAM,EAAE,CAAU;IAAlBC,gCAAAA,CAACA,GAAGA,EAAEA;AAAAA,IAAcA,IAAGA,UAAUA;AAAUA,SAAvBA,WAAuBA,CAAvBA,2BAAuBA,EAAvBA,IAAuBA;QAAvBA,mCAAuBA;;IAEtEA,MAAOA;AACXA,CAACA"}
var greetings = 0;
function greet(greeting) {
    greetings++;
    return greetings;
}
function greet2(greeting, n, x) {
    if (typeof n === "undefined") { n = 10; }
    var restParams = [];
    for (var _i = 0; _i < (arguments.length - 3); _i++) {
        restParams[_i] = arguments[_i + 3];
    }
    greetings++;
    return greetings;
}
function foo(greeting, n, x) {
    if (typeof n === "undefined") { n = 10; }
    var restParams = [];
    for (var _i = 0; _i < (arguments.length - 3); _i++) {
        restParams[_i] = arguments[_i + 3];
    }
    return;
}
//# sourceMappingURL=sourceMapValidationFunctions.js.map
