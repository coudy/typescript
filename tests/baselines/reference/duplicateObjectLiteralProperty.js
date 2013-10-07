var x = {
    a: 1,
    b: true,
    // OK
    a: 56,
    // Duplicate
    \u0061: "ss",
    // Duplicate
    a: {
        c: 1,
        "c": 56
    }
};

var y = {
    get a() {
        return 0;
    },
    set a(v) {
    },
    get a() {
        return 0;
    }
};
