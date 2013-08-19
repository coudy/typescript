{"version":3,"file":"sourceMap-FileWithComments.js","sourceRoot":"","sources":["sourceMap-FileWithComments.ts"],"names":["Shapes","Shapes.Point","Shapes.Point.constructor","Shapes.Point.getDist","Shapes.foo"],"mappings":";;AAMA,SAAS;AACT,IAAO,MAAM;AAwBZ,CAxBD,UAAO,MAAM;IAETA,QAAQA;IACRA;QAEIC,cADcA;QACdA,eAAYA,CAAgBA,EAAEA,CAAgBA;YAAlCC,MAAQA,GAADA,CAACA;AAAQA,YAAEA,MAAQA,GAADA,CAACA;AAAQA,QAAIA,CAACA;QAGnDD,kBADkBA;kCAClBA;YAAYE,OAAOA,IAAIA,CAACA,IAAIA,CAACA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,GAAGA,IAAIA,CAACA,CAACA,CAACA;QAAEA,CAACA;;QAGlEF,eAAgBA,IAAIA,KAAKA,CAACA,CAACA,EAAEA,CAACA,CAACA;QACnCA,aAACA;IAADA,CAACA,IAAAD;IATDA,qBASCA;;IAEDA,+BAA+BA;IAC/BA,IAAIA,CAACA,GAAGA,EAAEA;;IAEVA,SAAgBA,GAAGA;IACnBI,CAACA;IADDJ,iBACCA;;IAEDA;;MAEEA;IACFA,IAAIA,CAACA,GAAGA,EAAEA;AACdA,CAACA,2BAAA;;AAED,qBAAqB;AACrB,IAAI,CAAC,GAAW,IAAI,MAAM,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC;AACtC,IAAI,IAAI,GAAG,CAAC,CAAC,OAAO,CAAC,CAAC"}


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
//# sourceMappingURL=sourceMap-FileWithComments.js.map
