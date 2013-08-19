// Type type of the null literal is the Null type.
// Null can be converted to anything except Void
var n = (null);
var s = (null);
var b = (n);

function isVoid() {
}

if (null === isVoid()) {
}
