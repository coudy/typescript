{"version":3,"file":"sourceMapValidationFunctionExpressions.js","sourceRoot":"","sources":["sourceMapValidationFunctionExpressions.ts"],"names":["greet","incrGreetings"],"mappings":"AAAA,IAAI,SAAS,GAAG,CAAC;AACjB,IAAI,KAAK,GAAG,UAAC,QAAgB;IACzBA,SAASA,EAAEA;IACXA,OAAOA,SAASA;AACpBA,CAACA;AACD,KAAK,CAAC,OAAO,CAAC;AACd,IAAI,aAAa,GAAG;WAAMC,SAASA,EAAEA;AAAXA,CAAWA"}
var greetings = 0;
var greet = function (greeting) {
    greetings++;
    return greetings;
};
greet("Hello");
var incrGreetings = function () {
    return greetings++;
};
//# sourceMappingURL=sourceMapValidationFunctionExpressions.js.map
