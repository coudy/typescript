{"version":3,"file":"sourceMapValidationTryCatchFinally.js","sourceRoot":"","sources":["sourceMapValidationTryCatchFinally.ts"],"names":[],"mappings":"AAAA,IAAI,CAAC,GAAG,EAAE;AACV,IAAI;IACA,CAAC,GAAG,CAAC,GAAG,CAAC;CACZ,CAAC,OAAO,CAAC,CAAE;IACR,CAAC,GAAG,CAAC,GAAG,CAAC;CACZ,QAAS;IACN,CAAC,GAAG,CAAC,GAAG,EAAE;CACb;AACD,IACA;IACI,CAAC,GAAG,CAAC,GAAG,CAAC;IACT,MAAM,IAAI,KAAK,CAAC,CAAC;CACpB,CACD,OAAO,CAAC,CACR;IACI,CAAC,GAAG,CAAC,GAAG,CAAC;CACZ,QAED;IACI,CAAC,GAAG,CAAC,GAAG,EAAE;CACb"}
var x = 10;
try  {
    x = x + 1;
} catch (e) {
    x = x - 1;
} finally {
    x = x * 10;
}
try  {
    x = x + 1;
    throw new Error();
} catch (e) {
    x = x - 1;
} finally {
    x = x * 10;
}
//# sourceMappingURL=sourceMapValidationTryCatchFinally.js.map
