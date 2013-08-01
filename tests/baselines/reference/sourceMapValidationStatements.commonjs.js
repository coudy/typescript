{"version":3,"file":"sourceMapValidationStatements.js","sourceRoot":"","sources":["sourceMapValidationStatements.ts"],"names":["f","b"],"mappings":"AAAA,SAAS,CAAC;IACNA,IAAIA,CAACA;IACLA,IAAIA,CAACA,GAAGA,CAACA;IACTA,KAAKA,IAAIA,CAACA,GAAGA,CAACA,EAAEA,CAACA,GAAGA,EAAEA,EAAEA,CAACA,EAAEA,CAAEA;QACzBA,CAACA,IAAIA,CAACA;QACNA,CAACA,IAAIA,CAACA;KACTA;IACDA,IAAIA,CAACA,GAAGA,EAAEA,CAAEA;QACRA,CAACA,IAAIA,CAACA;KACTA,KAAMA;QACHA,CAACA,IAAIA,EAAEA;QACPA,CAACA,EAAEA;KACNA;IACDA,IAAIA,CAACA,GAAGA;QACJA,CAACA;QACDA,CAACA;QACDA,CAACA;KACJA;IACDA,IAAIA,GAAGA,GAAGA;QACNA,CAACA,EAAEA,CAACA;QACJA,CAACA,EAAEA,OAAOA;KACbA;IACDA,KAAKA,IAAIA,CAACA,IAAIA,CAACA,CAAEA;QACbA,GAAGA,CAACA,CAACA,GAAGA,CAACA,CAACA,CAACA,CAACA;QACZA,IAAIA,CAACA,GAAGA,EAAEA;KACbA;IACDA,IAAIA;QACAA,GAAGA,CAACA,CAACA,GAAGA,MAAMA;KACjBA,CAACA,OAAOA,CAACA,CAAEA;QACRA,IAAIA,GAAGA,CAACA,CAACA,GAAGA,EAAEA,CAAEA;YACZA,GAAGA,CAACA,CAACA,GAAGA,EAAEA;SACbA,KAAMA;YACHA,GAAGA,CAACA,CAACA,GAAGA,KAAKA;SAChBA;KACJA;IACDA,IAAIA;QACAA,MAAMA,IAAIA,KAAKA,CAACA,CAACA;KACpBA,CAACA,OAAOA,EAAEA,CAAEA;QACTA,IAAIA,CAACA,GAAGA,EAAEA;KACbA,QAASA;QACNA,CAACA,GAAGA,EAAEA;KACTA;IACDA,MAAMA,GAAGA,CAAEA;QACPA,CAACA,GAAGA,CAACA;QACLA,CAACA,GAAGA,EAAEA;KACTA;IACDA,QAAQA,GAAGA,CAACA,CAACA,CAAEA;QACXA,KAAKA,CAACA,CAAEA;YACJA,CAACA,EAAEA;YACHA,KAAMA;SAETA;AAAAA,QACDA,KAAKA,CAACA,CAAEA;YACJA,CAACA,EAAEA;YACHA,KAAMA;SAETA;AAAAA,QACDA,QAASA;YACLA,CAACA,IAAIA,CAACA;YACNA,CAACA,GAAGA,EAAEA;YACNA,KAAMA;SAETA;AAAAA,KACJA;IACDA,OAAOA,CAACA,GAAGA,EAAEA,CAAEA;QACXA,CAACA,EAAEA;KACNA;IACDA,EAAGA;QACCA,CAACA,EAAEA;KACNA,MAAMA,CAAEA,CAACA,GAAGA,CAACA,CAACA;IACfA,CAACA,GAAGA,CAACA;IACLA,IAAIA,CAACA,GAAGA,CAACA,CAACA,IAAIA,CAACA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA;IAChCA,CAACA,CAACA,IAAIA,CAACA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA,GAAGA,CAACA;IACxBA,CAACA,KAAKA,CAACA;IACPA,CAACA,GAAGA,CAACA,GAAGA,EAAEA;IACVA,IAAIA,CAACA,GAAGA,CAACA;IACTA,MAAOA;AACXA,CAACA;AACD,IAAI,CAAC,GAAG;IACJC,IAAIA,CAACA,GAAGA,EAAEA;IACVA,CAACA,GAAGA,CAACA,GAAGA,CAACA;AACbA,CAACA;AACD,CAAC,CAAC,CAAC"}
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
