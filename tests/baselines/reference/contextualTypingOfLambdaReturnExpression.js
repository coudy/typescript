function callb(a) {
}

callb(function (a) {
    return a.length;
});
callb(function (a) {
    a.length;
}); // Error, we picked the first overload and errored when type checking the lambda body
