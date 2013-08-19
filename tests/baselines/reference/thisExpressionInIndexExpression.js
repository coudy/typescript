function f() {
    var _this = this;
    return function (r) {
        return r[_this];
    };
}
