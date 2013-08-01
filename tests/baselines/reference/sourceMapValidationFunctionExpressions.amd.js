{"version":3,"file":"sourceMapValidationFunctionExpressions.js","sourceRoot":"","sources":["sourceMapValidationFunctionExpressions.ts"],"names":["greet","incrGreetings"],"mappings":"AAAA,IAAI,SAAS,GAAG,CAAC,CAAC;AAClB,IAAI,KAAK,GAAG,UAAC,QAAgB;IACzBA,SAASA,EAAEA,CAACA;IACZA,OAAOA,SAASA,CAACA;AACrBA,CAACA,CAAA;AACD,KAAK,CAAC,OAAO,CAAC,CAAC;AACf,IAAI,aAAa,GAAG;WAAMC,SAASA,EAAEA;CAAA,CAAC"}
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
