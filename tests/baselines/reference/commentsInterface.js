var i1_i;

var nc_i1_i;

var i2_i;
var i2_i_x = i2_i.x;
var i2_i_foo = i2_i.foo;
var i2_i_foo_r = i2_i.foo(30);
var i2_i_i2_si = i2_i["hello"];
var i2_i_i2_ii = i2_i[30];
var i2_i_n = new i2_i(i1_i);
var i2_i_nc_x = i2_i.nc_x;
var i2_i_nc_foo = i2_i.nc_foo;
var i2_i_nc_foo_r = i2_i.nc_foo(30);
var i2_i_r = i2_i(10, 20);
var i2_i_fnfoo = i2_i.fnfoo;
var i2_i_fnfoo_r = i2_i.fnfoo(10);
var i2_i_nc_fnfoo = i2_i.nc_fnfoo;
var i2_i_nc_fnfoo_r = i2_i.nc_fnfoo(10);

var i3_i;
i3_i = {
    f: /**own f*/ function (/**i3_i a*/ a) {
        return "Hello" + a;
    },
    l: this.f,
    /** own x*/
    x: this.f(10),
    nc_x: this.l(this.x),
    nc_f: this.f,
    nc_l: this.l
};
i3_i.f(10);
i3_i.l(10);
i3_i.nc_f(10);
i3_i.nc_l(10);
