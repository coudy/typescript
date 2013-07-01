var C = (function () {
    function C() {
        this.nullMember = null;
    }
    Object.defineProperty(C.prototype, "NullMember", {
        get: function () {
            return this.nullMember;
        },
        set: function (value) {
            this.nullMember = value;
        },
        enumerable: true,
        configurable: true
    });

    return C;
})();
