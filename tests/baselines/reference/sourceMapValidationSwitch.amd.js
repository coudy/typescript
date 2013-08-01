{"version":3,"file":"sourceMapValidationSwitch.js","sourceRoot":"","sources":["sourceMapValidationSwitch.ts"],"names":[],"mappings":"AAAA,IAAI,CAAC,GAAG,EAAE,CAAC;AACX,QAAQ,CAAC,CAAE;IACP,KAAK,CAAC;AACF,QAAA,CAAC,EAAE,CAAC;QACJ,MAAM;AAAA,IACV,KAAK,EAAE,CACH;QACI,CAAC,EAAE,CAAC;QACJ,MAAM;KACT;AAAA,IACL;AACI,QAAA,CAAC,GAAG,CAAC,GAAE,EAAE,CAAC;AAAA,CACjB;AACD,QAAQ,CAAC,CACT;IACI,KAAK,CAAC;AACF,QAAA,CAAC,EAAE,CAAC;QACJ,MAAM;AAAA,IACV,KAAK,EAAE,CACH;QACI,CAAC,EAAE,CAAC;QACJ,MAAM;KACT;AAAA,IACL,QACI;QACI,CAAC,GAAG,CAAC,GAAG,EAAE,CAAC;KACd;AAAA,CACR"}
var x = 10;
switch (x) {
    case 5:
        x++;
        break;
    case 10: {
        x--;
        break;
    }
    default:
        x = x * 10;
}
switch (x) {
    case 5:
        x++;
        break;
    case 10: {
        x--;
        break;
    }
    default: {
        x = x * 10;
    }
}
//# sourceMappingURL=sourceMapValidationSwitch.js.map
