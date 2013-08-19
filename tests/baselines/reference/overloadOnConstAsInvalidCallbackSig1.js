function x3(a, cb) {
    cb(a);
}

// both should be errors
x3(1, function (x) {
    return 1;
});

x3(1, function (x) {
    return 1;
});
