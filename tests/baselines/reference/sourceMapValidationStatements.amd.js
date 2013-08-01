{"version":3,"file":"sourceMapValidationStatements.js","sourceRoot":"","sources":["sourceMapValidationStatements.ts"],"names":["f","b"],"mappings":"AAAA,SAAS,CAAC;IACNA,IAAIA,CAACA,CAACA;IACNA,IAAIA,CAACA,GAAGA,CAACA,CAACA;IACVA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,EAAEA,EAAEA,CAACA,EAAEA,CAAEA;QACzBA,CAACA,IAAIA,CAACA,CAACA;QACPA,CAACA,IAAIA,CAACA,CAACA;KACVA;IACDA,IAAIA,CAACA,GAAGA,EAAEA,CAAEA;QACRA,CAACA,IAAIA,CAACA,CAACA;KACVA,KAAMA;QACHA,CAACA,IAAIA,EAAEA,CAACA;QACRA,CAACA,EAAEA,CAACA;KACPA;IACDA,IAAIA,CAACA,GAAGA;QACJA,CAACA;QACDA,CAACA;QACDA,CAACA;KACJA,CAACA;IACFA,IAAIA,GAAGA,GAAGA;QACNA,CAACA,EAAEA,CAACA;QACJA,CAACA,EAAEA,OAAOA;KACbA,CAACA;IACFA,KAAKA,IAAIA,CAACA,IAAIA,CAACA,CAAEA;QACbA,GAAGA,CAACA,CAACA,GAAGA,CAACA,CAACA,CAACA,CAACA,CAACA;QACbA,IAAIA,CAACA,GAAGA,EAAEA,CAACA;KACdA;IACDA,IAAIA;QACAA,GAAGA,CAACA,CAACA,GAAGA,MAAMA,CAACA;KAClBA,QAAQA,CAACA,CAAEA;QACRA,IAAIA,GAAGA,CAACA,CAACA,GAAGA,EAAEA,CAAEA;YACZA,GAAGA,CAACA,CAACA,GAAGA,EAAEA,CAACA;SACdA,KAAMA;YACHA,GAAGA,CAACA,CAACA,GAAGA,KAAKA,CAACA;SACjBA;KACJA;IACDA,IAAIA;QACAA,MAAMA,IAAIA,KAAKA,CAACA,CAACA,CAACA;KACrBA,QAAQA,EAAEA,CAAEA;QACTA,IAAIA,CAACA,GAAGA,EAAEA,CAACA;KACdA,QAASA;QACNA,CAACA,GAAGA,EAAEA,CAACA;KACVA;IACDA,MAAMA,GAAGA,CAAEA;QACPA,CAACA,GAAGA,CAACA,CAACA;QACNA,CAACA,GAAGA,EAAEA,CAACA;KACVA;IACDA,QAAQA,GAAGA,CAACA,CAACA,CAAEA;QACXA,KAAKA,CAACA,CAAEA;YACJA,CAACA,EAAEA,CAACA;YACJA,MAAMA;SAETA;AAAAA,QACDA,KAAKA,CAACA,CAAEA;YACJA,CAACA,EAAEA,CAACA;YACJA,MAAMA;SAETA;AAAAA,QACDA,QAASA;YACLA,CAACA,IAAIA,CAACA,CAACA;YACPA,CAACA,GAAGA,EAAEA,CAACA;YACPA,MAAMA;SAETA;AAAAA,KACJA;IACDA,OAAOA,CAACA,GAAGA,EAAEA,CAAEA;QACXA,CAACA,EAAEA,CAACA;KACPA;IACDA,EAAGA;QACCA,CAACA,EAAEA,CAACA;KACPA,MAAMA,CAAEA,CAACA,GAAGA,CAACA,EAACA;IACfA,CAACA,GAAGA,CAACA,CAACA;IACNA,IAAIA,CAACA,GAAGA,CAACA,CAACA,IAAIA,CAACA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,CAACA;IACjCA,CAACA,CAACA,IAAIA,CAACA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,CAACA;IACzBA,CAACA,KAAKA,CAACA,CAACA;IACRA,CAACA,GAAGA,CAACA,GAAGA,EAAEA,CAACA;IACXA,IAAIA,CAACA,GAAGA,CAACA,CAACA;IACVA,OAAOA;AACXA,CAACA;AACD,IAAI,CAAC,GAAG;IACJC,IAAIA,CAACA,GAAGA,EAAEA,CAACA;IACXA,CAACA,GAAGA,CAACA,GAAGA,CAACA,CAACA;AACdA,CAACA,CAAC;AACF,CAAC,CAAC,CAAC,CAAC"}
function f() {
    var y;
    var x = 0;
    for (var i = 0; i < 10; i++) {
        x += i;
        x *= 0;
    }
    if (x > 17) {
        x /= 9;
    } else {
        x += 10;
        x++;
    }
    var a = [
        1,
        2,
        3
    ];
    var obj = {
        z: 1,
        q: "hello"
    };
    for (var j in a) {
        obj.z = a[j];
        var v = 10;
    }
    try  {
        obj.q = "ohhh";
    } catch (e) {
        if (obj.z < 10) {
            obj.z = 12;
        } else {
            obj.q = "hmm";
        }
    }
    try  {
        throw new Error();
    } catch (e1) {
        var b = e1;
    } finally {
        y = 70;
    }
    with (obj) {
        i = 2;
        z = 10;
    }
    switch (obj.z) {
        case 0: {
            x++;
            break;
        }
        case 1: {
            x--;
            break;
        }
        default: {
            x *= 2;
            x = 50;
            break;
        }
    }
    while (x < 10) {
        x++;
    }
    do {
        x--;
    } while(x > 4);
    x = y;
    var z = (x == 1) ? x + 1 : x - 1;
    (x == 1) ? x + 1 : x - 1;
    x === 1;
    x = z = 40;
    eval("y");
    return;
}
var b = function () {
    var x = 10;
    x = x + 1;
};
f();
//# sourceMappingURL=sourceMapValidationStatements.js.map
