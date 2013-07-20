function strange(x, y, z) {
    if (typeof y === "undefined") { y = x * 1; }
    if (typeof z === "undefined") { z = x + y; }
    return z;
}
