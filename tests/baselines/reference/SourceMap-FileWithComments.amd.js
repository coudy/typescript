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
        Point.prototype.getDist = // Instance member
        function () {
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
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["Shapes","Shapes.Point","Shapes.Point.constructor","Shapes.Point.getDist","Shapes.foo"],"mappings":"AAQA,SAAS;AACT,IAAO,MAAM;AAwBZ,CAxBD,UAAO,MAAM;IAETA,QAAQA;IACRA;QAEIC,cADcA;QACdA,SAFSA,KAAKA,CAEFA,CAAgBA,EAAEA,CAAgBA;YAAlCC,MAAQA,GAADA,CAACA;AAAQA,YAAEA,MAAQA,GAADA,CAACA;AAAQA,QAAIA,CAACA;QAGnDD,0BADAA,kBAAkBA;QAClBA;YAAYE,OAAOA,IAAIA,CAACA,IAAIA,CAACA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,CAACA,CAACA;QAACA,CAACA;QAGlEF,eAAgBA,IAAIA,KAAKA,CAACA,CAACA,EAAEA,CAACA,CAACA;AAAAA,QACnCA;AAACA,IAADA,CAACA,IAAAD;IATDA,qBASCA,IAAAA;IAEDA,+BAA+BA;IAC/BA,IAAIA,CAACA,GAAGA,EAAEA,CAACA;IAEXA,SAAgBA,GAAGA;IACnBI,CAACA;IADDJ;AACCA,IAEDA;;MAEEA;IACFA,IAAIA,CAACA,GAAGA,EAAEA,CAACA;AACfA,CAACA,2BAAA;AAED,qBAAqB;AACrB,IAAI,CAAC,GAAW,IAAI,MAAM,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC;AACvC,IAAI,IAAI,GAAG,CAAC,CAAC,OAAO,EAAE,CAAC"}
////[comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[importInsideModule_file1.js]
//@ sourceMappingURL=importInsideModule_file1.js.map
////[importInsideModule_file2.js]
//@ sourceMappingURL=importInsideModule_file2.js.map