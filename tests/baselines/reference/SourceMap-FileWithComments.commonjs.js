////[0.js.map]
{"version":3,"file":"0.js","sourceRoot":"","sources":["file:///0.ts"],"names":["Shapes","Shapes.Point","Shapes.Point.constructor","Shapes.Point.getDist","Shapes.foo"],"mappings":"AAMA,SAAS;AACT,IAAO,MAAM;AAwBZ,CAxBD,UAAO,MAAM;IAETA,QAAQA;IACRA;QAEIC,cADcA;QACdA,eAAYA,CAAgBA,EAAEA,CAAgBA;YAAlCC,MAAQA,GAADA,CAACA;AAAQA,YAAEA,MAAQA,GAADA,CAACA;AAAQA,QAAIA,CAACA;QAGnDD,kBADkBA;kCAClBA;YAAYE,OAAOA,IAAIA,CAACA,IAAIA,CAACA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,CAACA,CAACA;QAACA,CAACA;;QAGlEF,eAAgBA,IAAIA,KAAKA,CAACA,CAACA,EAAEA,CAACA,CAACA;AAACA,QACpCA;AAACA,IAADA,CAACA,IAAAD;IATDA,qBASCA;;IAGDA,+BAD+BA;IAC3BA,IAAAA,CAACA,GAAGA,EAAEA,CAACA;;IAEXA,SAAgBA,GAAGA;IACnBI,CAACA;IADDJ,iBACCA;;IAKDA;;MADEA;IACEA,IAAAA,CAACA,GAAGA,EAAEA,CAACA;AACfA,CAACA,2BAAA;;AAGD,qBADqB;AACjB,IAAA,CAAC,GAAW,IAAI,MAAM,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC;AACvC,IAAI,IAAI,GAAG,CAAC,CAAC,OAAO,CAAC,CAAC,CAAC"}
// Module
var Shapes;
(function (Shapes) {
    // Class
    var Point = (function () {
        // Constructor
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        // Instance member
        Point.prototype.getDist = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Point.origin = new Point(0, 0);
        return Point;
    })();
    Shapes.Point = Point;

    // Variable comment after class
    var a = 10;

    function foo() {
    }
    Shapes.foo = foo;

    /**  comment after function
    * this is another comment
    */
    var b = 10;
})(Shapes || (Shapes = {}));

/** Local Variable */
var p = new Shapes.Point(3, 4);
var dist = p.getDist();
//# sourceMappingURL=0.js.map

////[importInsideModule_file1.js.map]
{"version":3,"file":"importInsideModule_file1.js","sourceRoot":"","sources":["file:///importInsideModule_file1.ts"],"names":[],"mappings":""}
////[importInsideModule_file1.js]
//# sourceMappingURL=importInsideModule_file1.js.map

////[importInsideModule_file2.js.map]
{"version":3,"file":"importInsideModule_file2.js","sourceRoot":"","sources":["file:///importInsideModule_file2.ts"],"names":[],"mappings":""}
////[importInsideModule_file2.js]
//# sourceMappingURL=importInsideModule_file2.js.map

////[modulesImportedForTypeArgumentPosition_0.js.map]
{"version":3,"file":"modulesImportedForTypeArgumentPosition_0.js","sourceRoot":"","sources":["file:///modulesImportedForTypeArgumentPosition_0.ts"],"names":[],"mappings":""}
////[modulesImportedForTypeArgumentPosition_0.js]
//# sourceMappingURL=modulesImportedForTypeArgumentPosition_0.js.map

////[modulesImportedForTypeArgumentPosition_1.js.map]
{"version":3,"file":"modulesImportedForTypeArgumentPosition_1.js","sourceRoot":"","sources":["file:///modulesImportedForTypeArgumentPosition_1.ts"],"names":[],"mappings":""}
////[modulesImportedForTypeArgumentPosition_1.js]
//# sourceMappingURL=modulesImportedForTypeArgumentPosition_1.js.map
