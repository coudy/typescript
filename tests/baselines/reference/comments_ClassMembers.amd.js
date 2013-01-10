// @target: ES5
// @declaration: true
// @comments: true
/// This is comment for c1
var c1 = (function () {
    /// Constructor method
    function c1() {
    }
    c1.prototype.p2 = /// sum with property
    function (/** number to add*/ b) {
        return this.p1 + b;
    };
    Object.defineProperty(c1.prototype, "p3", {
        get: /// getter property
        function () {
            return this.p2(this.p1);
        },
        set: /// setter property
        function (/** this is value*/ value) {
            this.p1 = this.p2(value);
        },
        enumerable: true,
        configurable: true
    });
    c1.prototype.pp2 = /// sum with property
    function (/** number to add*/ b) {
        return this.p1 + b;
    };
    Object.defineProperty(c1.prototype, "pp3", {
        get: /// getter property
        function () {
            return this.pp2(this.pp1);
        },
        set: /// setter property
        function (/** this is value*/ value) {
            this.pp1 = this.pp2(value);
        },
        enumerable: true,
        configurable: true
    });
    c1.s2 = /// static sum with property
    function s2(/** number to add*/ b) {
        return c1.s1 + b;
    };
    Object.defineProperty(c1, "s3", {
        get: /// static getter property
        function () {
            return c1.s2(c1.s1);
        },
        set: /// setter property
        function (/** this is value*/ value) {
            c1.s1 = c1.s2(value);
        },
        enumerable: true,
        configurable: true
    });
    c1.prototype.nc_p2 = function (b) {
        return this.nc_p1 + b;
    };
    Object.defineProperty(c1.prototype, "nc_p3", {
        get: function () {
            return this.nc_p2(this.nc_p1);
        },
        set: function (value) {
            this.nc_p1 = this.nc_p2(value);
        },
        enumerable: true,
        configurable: true
    });
    c1.prototype.nc_pp2 = function (b) {
        return this.nc_pp1 + b;
    };
    Object.defineProperty(c1.prototype, "nc_pp3", {
        get: function () {
            return this.nc_pp2(this.nc_pp1);
        },
        set: function (value) {
            this.nc_pp1 = this.nc_pp2(value);
        },
        enumerable: true,
        configurable: true
    });
    c1.nc_s2 = function nc_s2(b) {
        return c1.nc_s1 + b;
    };
    Object.defineProperty(c1, "nc_s3", {
        get: function () {
            return c1.nc_s2(c1.nc_s1);
        },
        set: function (value) {
            c1.nc_s1 = c1.nc_s2(value);
        },
        enumerable: true,
        configurable: true
    });
    return c1;
})();
var i1 = new c1();
var i1_p = i1.p1;
var i1_f = i1.p2;
var i1_r = i1.p2(20);
var i1_prop = i1.p3;
i1.p3 = i1_prop;
var i1_nc_p = i1.nc_p1;
var i1_ncf = i1.nc_p2;
var i1_ncr = i1.nc_p2(20);
var i1_ncprop = i1.nc_p3;
i1.nc_p3 = i1_ncprop;
var i1_s_p = c1.s1;
var i1_s_f = c1.s2;
var i1_s_r = c1.s2(20);
var i1_s_prop = c1.s3;
c1.s3 = i1_s_prop;
var i1_s_nc_p = c1.nc_s1;
var i1_s_ncf = c1.nc_s2;
var i1_s_ncr = c1.nc_s2(20);
var i1_s_ncprop = c1.nc_s3;
c1.nc_s3 = i1_s_ncprop;
var i1_c = c1;
var cProperties = (function () {
    function cProperties() { }
    Object.defineProperty(cProperties.prototype, "p1", {
        get: /// getter only property
        function () {
            return this.val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cProperties.prototype, "nc_p1", {
        get: function () {
            return this.val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cProperties.prototype, "p2", {
        set: ///setter only property
        function (value) {
            this.val = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cProperties.prototype, "nc_p2", {
        set: function (value) {
            this.val = value;
        },
        enumerable: true,
        configurable: true
    });
    return cProperties;
})();
var cProperties_i = new cProperties();
cProperties_i.p2 = cProperties_i.p1;
cProperties_i.nc_p2 = cProperties_i.nc_p1;
////[0.d.ts]
/// This is comment for c1
class c1 {
    /// p1 is property of c1
    public p1: number;
    /// sum with property
    public p2(/** number to add*/ b: number): number;
    /// getter property
    /// setter property
    public p3 : number;
    /// pp1 is property of c1
    private pp1;
    /// sum with property
    private pp2(/** number to add*/ b);
    /// getter property
    /// setter property
    private pp3;
    /// Constructor method
    constructor();
    /// s1 is static property of c1
    static s1: number;
    /// static sum with property
    static s2(/** number to add*/ b: number): number;
    /// static getter property
    /// setter property
    static s3 : number;
    public nc_p1: number;
    public nc_p2(b: number): number;
    public nc_p3 : number;
    private nc_pp1;
    private nc_pp2(b);
    private nc_pp3;
    static nc_s1: number;
    static nc_s2(b: number): number;
    static nc_s3 : number;
}
var i1: c1;
var i1_p: number;
var i1_f: (b: number) => number;
var i1_r: number;
var i1_prop: number;
var i1_nc_p: number;
var i1_ncf: (b: number) => number;
var i1_ncr: number;
var i1_ncprop: number;
var i1_s_p: number;
var i1_s_f: (b: number) => number;
var i1_s_r: number;
var i1_s_prop: number;
var i1_s_nc_p: number;
var i1_s_ncf: (b: number) => number;
var i1_s_ncr: number;
var i1_s_ncprop: number;
var i1_c: {
    s1: number;
    s2(b: number): number;
    s3: number;
    nc_s1: number;
    nc_s2(b: number): number;
    nc_s3: number;
    new(): c1;
};
class cProperties {
    private val;
    /// getter only property
    public p1 : number;
    public nc_p1 : number;
    ///setter only property
    public p2 : number;
    public nc_p2 : number;
}
var cProperties_i: cProperties;