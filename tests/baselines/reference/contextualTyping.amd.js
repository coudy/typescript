var C1T5 = (function () {
    function C1T5() {
        this.foo = function (i) {
            return i;
        };
    }
    return C1T5;
})();
var C2T5;
(function (C2T5) {
    C2T5.foo = function (i) {
        return i;
    };
})(C2T5 || (C2T5 = {}));
var c3t1 = (function (s) {
    return s;
});
var c3t2 = ({
    n: 1
});
var c3t3 = [];
var c3t4 = function () {
    return ({});
};
var c3t5 = function (n) {
    return ({});
};
var c3t6 = function (n, s) {
    return ({});
};
var c3t7 = function (n) {
    return n;
};
var c3t8 = function (n) {
    return n;
};
var c3t9 = [
    [], 
    []
];
var c3t10 = [
    ({}), 
    ({})
];
var c3t11 = [
    function (n, s) {
        return s;
    }];
var c3t12 = {
    foo: ({})
};
var c3t13 = ({
    f: function (i, s) {
        return s;
    }
});
var c3t14 = ({
    a: []
});
var C4T5 = (function () {
    function C4T5() {
        this.foo = function (i, s) {
            return s;
        };
    }
    return C4T5;
})();
var C5T5;
(function (C5T5) {
    C5T5.foo;
    C5T5.foo = function (i, s) {
        return s;
    };
})(C5T5 || (C5T5 = {}));
var c6t5;
c6t5 = function (n) {
    return ({});
};
var c7t2;
c7t2[0] = ({
    n: 1
});
var objc8 = ({});
objc8.t1 = (function (s) {
    return s;
});
objc8.t2 = ({
    n: 1
});
objc8.t3 = [];
objc8.t4 = function () {
    return ({});
};
objc8.t5 = function (n) {
    return ({});
};
objc8.t6 = function (n, s) {
    return ({});
};
objc8.t7 = function (n) {
    return n;
};
objc8.t8 = function (n) {
    return n;
};
objc8.t9 = [
    [], 
    []
];
objc8.t10 = [
    ({}), 
    ({})
];
objc8.t11 = [
    function (n, s) {
        return s;
    }];
objc8.t12 = {
    foo: ({})
};
objc8.t13 = ({
    f: function (i, s) {
        return s;
    }
});
objc8.t14 = ({
    a: []
});
function c9t5(f) {
}
;

c9t5(function (n) {
    return ({});
});
var c10t5 = function () {
    return function (n) {
        return ({});
    };
};
var C11t5 = (function () {
    function C11t5(f) {
    }
    return C11t5;
})();
;

var i = new C11t5(function (n) {
    return ({});
});
var c12t1 = (function (s) {
    return s;
});
var c12t2 = ({
    n: 1
});
var c12t3 = [];
var c12t4 = function () {
    return ({});
};
var c12t5 = function (n) {
    return ({});
};
var c12t6 = function (n, s) {
    return ({});
};
var c12t7 = function (n) {
    return n;
};
var c12t8 = function (n) {
    return n;
};
var c12t9 = [
    [], 
    []
];
var c12t10 = [
    ({}), 
    ({})
];
var c12t11 = [
    function (n, s) {
        return s;
    }];
var c12t12 = {
    foo: ({})
};
var c12t13 = ({
    f: function (i, s) {
        return s;
    }
});
var c12t14 = ({
    a: []
});
function EF1(a, b) {
    return a + b;
}
var efv = EF1(1, 2);

function Point(x, y) {
    this.x = x;
    this.y = y;
    return this;
}
Point.origin = new Point(0, 0);
Point.prototype.add = function (dx, dy) {
    return new Point(this.x + dx, this.y + dy);
};
Point.prototype = {
    x: 0,
    y: 0,
    add: function (dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    }
};
window.onmousedown = function (ev) {
    ev.bubbles;
};
var x = {};
//@ sourceMappingURL=0.js.map
////[0.js.map]
{"version":3,"file":"0.js","sources":["0.ts"],"names":["C1T5","C1T5.constructor","","C2T5","C2T5.foo","","c3t4","c3t5","c3t6","c3t7","c3t8","","f","C4T5","C4T5.constructor","C4T5.constructor.foo","C5T5","C5T5.foo","","","t4","t5","t6","t7","t8","","f","c9t5","","c10t5","","C11t5","C11t5.constructor","","","","","","","","","f","EF1","Point","add","add","onmousedown"],"mappings":"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"}
////[comments_ExternalModules_0.js]
//@ sourceMappingURL=comments_ExternalModules_0.js.map
////[comments_ExternalModules_0.js.map]
{"version":3,"file":"comments_ExternalModules_0.js","sources":["comments_ExternalModules_0.ts"],"names":[],"mappings":""}
////[comments_ExternalModules_1.js]
//@ sourceMappingURL=comments_ExternalModules_1.js.map
////[comments_ExternalModules_1.js.map]
{"version":3,"file":"comments_ExternalModules_1.js","sources":["comments_ExternalModules_1.ts"],"names":[],"mappings":""}
////[comments_MultiModule_MultiFile_0.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_0.js.map
////[comments_MultiModule_MultiFile_0.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_0.js","sources":["comments_MultiModule_MultiFile_0.ts"],"names":[],"mappings":""}
////[comments_MultiModule_MultiFile_1.js]
//@ sourceMappingURL=comments_MultiModule_MultiFile_1.js.map
////[comments_MultiModule_MultiFile_1.js.map]
{"version":3,"file":"comments_MultiModule_MultiFile_1.js","sources":["comments_MultiModule_MultiFile_1.ts"],"names":[],"mappings":""}