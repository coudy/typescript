function dupe(x) {
    return x;
}
function dupeAndGetDist(x) {
    var y = dupe(x);
    y.getDist();
    return y;
}
