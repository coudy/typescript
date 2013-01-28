var simpleVar;
var anotherVar;
var varWithSimpleType;
var varWithArrayType;
var varWithInitialValue = 30;
var withComplicatedValue = {
    x: 30,
    y: 70,
    desc: "position"
};
var arrayVar = [
    'a', 
    'b'
];
var complicatedArrayVar;
complicatedArrayVar.push({
    x: 30,
    y: 'hello world'
});
var n1;
var c;
var d;
var d3;
var d2;
var n2;
var n4;
var d4;
var m2;
(function (m2) {
    m2.a;
    m2.b2 = 10;
    m2.b;
    var m1;
    var a2, b22 = 10, b222;
    var m3;
    var C = (function () {
        function C(b) {
            this.b = b;
        }
        return C;
    })();    
    var C2 = (function () {
        function C2(b) {
            this.b = b;
        }
        return C2;
    })();
    m2.C2 = C2;    
    var m;
    var b2;
    m2.mE;
    m2.b2E;
})(m2 || (m2 = {}));
var a22, b22 = 10, c22 = 30;
var nn;
var normalVar;
var xl;
var x;
var z;
function foo(a2) {
    var a = 10;
}
for(var i = 0, j = 0; i < 10; i++) {
    j++;
}
for(var i = 0; i < 30; i++) {
    i++;
}
var b = 10;
////[0.d.ts]
var simpleVar;
var anotherVar: any;
var varWithSimpleType: number;
var varWithArrayType: number[];
var varWithInitialValue: number;
var withComplicatedValue: {
    x: number;
    y: number;
    desc: string;
};
var arrayVar: string[];
var complicatedArrayVar: {
    x: number;
    y: string;
}[];
var n1: {
    [s: string]: number;
};
var c: {
    new?(): any;
};
var d: {
    foo?(): {
        x: number;
    };
};
var d3: {
    foo(): {
        x: number;
        y: number;
    };
};
var d2: {
    foo(): {
        x: number;
    };
};
var n2: () => void;
var n4: {
    (): void;
}[];
var d4: {
    foo(n: string, x: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
};
module m2 {
    export var a, b2: number, b;
    export class C2 {
        public b;
        constructor(b);
    }
    export var mE;
    export var d1E, d2E;
    export var b2E;
    export var v1E;
}
var a22, b22: number, c22: number;
var nn;
var normalVar;
var xl;
var x;
var z;
function foo(a2): void;
var b: number;