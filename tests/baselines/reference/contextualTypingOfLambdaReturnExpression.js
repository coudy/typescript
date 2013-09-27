function callb(a) {
}

callb(function (a) {
    a.length;
});
callb(function (a) {
    return a.length;
});// Error, we picked the first overload even though it had a provisional error accessing a.length.
