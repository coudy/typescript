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