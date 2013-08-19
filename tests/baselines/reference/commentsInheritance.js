var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var c1 = (function () {
    function c1() {
    }
    // i1_f1
    c1.prototype.i1_f1 = function () {
    };

    c1.prototype.i1_nc_f1 = function () {
    };

    /** c1_f1*/
    c1.prototype.f1 = function () {
    };

    /** c1_nc_f1*/
    c1.prototype.nc_f1 = function () {
    };
    return c1;
})();
var i1_i;
var c1_i = new c1();

// assign to interface
i1_i = c1_i;
var c2 = (function () {
    /** c2 constructor*/
    function c2(a) {
        this.c2_p1 = a;
    }
    /** c2 c2_f1*/
    c2.prototype.c2_f1 = function () {
    };

    Object.defineProperty(c2.prototype, "c2_prop", {
        get: /** c2 c2_prop*/
        function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });

    c2.prototype.c2_nc_f1 = function () {
    };
    Object.defineProperty(c2.prototype, "c2_nc_prop", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });

    /** c2 f1*/
    c2.prototype.f1 = function () {
    };

    Object.defineProperty(c2.prototype, "prop", {
        get: /** c2 prop*/
        function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });

    c2.prototype.nc_f1 = function () {
    };
    Object.defineProperty(c2.prototype, "nc_prop", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    return c2;
})();
var c3 = (function (_super) {
    __extends(c3, _super);
    function c3() {
        _super.call(this, 10);
    }
    /** c3 f1*/
    c3.prototype.f1 = function () {
    };

    Object.defineProperty(c3.prototype, "prop", {
        get: /** c3 prop*/
        function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });

    c3.prototype.nc_f1 = function () {
    };
    Object.defineProperty(c3.prototype, "nc_prop", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    return c3;
})(c2);
var c2_i = new c2(10);
var c3_i = new c3();

// assign
c2_i = c3_i;
var c4 = (function (_super) {
    __extends(c4, _super);
    function c4() {
        _super.apply(this, arguments);
    }
    return c4;
})(c2);
var c4_i = new c4(10);

var i2_i;
var i3_i;

// assign to interface
i2_i = i3_i;
