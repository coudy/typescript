{"version":3,"file":"sourceMapValidationTryCatchFinally.js","sourceRoot":"","sources":["sourceMapValidationTryCatchFinally.ts"],"names":[],"mappings":"AAAA,IAAI,CAAC,GAAG,EAAE,CAAC;AACX,IAAI;IACA,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;CACb,QAAQ,CAAC,CAAE;IACR,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;CACb,QAAS;IACN,CAAC,GAAG,CAAC,GAAG,EAAE,CAAC;CACd;AACD,IACA;IACI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;IACV,MAAM,IAAI,KAAK,CAAC,CAAC,CAAC;CACrB,QACM,CAAC,CACR;IACI,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;CACb,QAED;IACI,CAAC,GAAG,CAAC,GAAG,EAAE,CAAC;CACd"}
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
