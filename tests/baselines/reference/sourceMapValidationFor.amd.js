{"version":3,"file":"sourceMapValidationFor.js","sourceRoot":"","sources":["sourceMapValidationFor.ts"],"names":[],"mappings":"AAAA,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,EAAE,EAAE,CAAC,EAAE,CAAE;IACzB,OAAO,CAAC,IAAI,CAAC,KAAK,GAAG,CAAC,CAAC;CAC1B;AACD,KAAK,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,EAAE,EAAE,CAAC,EAAE,CACvB;IACI,OAAO,CAAC,IAAI,CAAC,KAAK,GAAG,CAAC,CAAC;CAC1B;AACD,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,EAAE,EAAI;IACtB,CAAC,EAAE;IACH,IAAI,CAAC,IAAI,CAAC,CAAE;QACR,QAAS;KACZ;CACJ;AACD,KAAK,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,EAAE,EAClB;IACI,CAAC,EAAE;CACN;AACD,KAAK,IAAI,CAAC,GAAG,CAAC,IAAG,CAAC,EAAE,CAAE;CACrB;AACD,KAAK,CAAC,GAAG,CAAC,IAAG,CAAC,EAAE,CAChB;CACC;AACD,OAAO,CAAC,GAAG,EAAE,EAAE,CAAC,EAAE,CAAE;CACnB;AACD,SAAS;IACL,CAAC,EAAE;CACN;AACD,SACA;IACI,CAAC,EAAE;CACN;AACD,KAAK,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,EAAE,EAAE,CAAC,GAAG,EAAE,EAAE,CAAC,GAAG,EAAE,EAAE,CAAC,EAAE,CAAE;CACxC"}
for (var i = 0; i < 10; i++) {
    WScript.Echo("i: " + i);
}
for (i = 0; i < 10; i++) {
    WScript.Echo("i: " + i);
}
for (var j = 0; j < 10;) {
    j++;
    if (j == 1) {
        continue;
    }
}
for (j = 0; j < 10;) {
    j++;
}
for (var k = 0; ; k++) {
}
for (k = 0; ; k++) {
}
for (; k < 10; k++) {
}
for (; ;) {
    i++;
}
for (; ;) {
    i++;
}
for (i = 0, j = 20; j < 20, i < 20; j++) {
}
//# sourceMappingURL=sourceMapValidationFor.js.map
