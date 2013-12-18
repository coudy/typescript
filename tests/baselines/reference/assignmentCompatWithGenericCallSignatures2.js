// some complex cases of assignment compat of generic signatures that stress contextual signature instantiation

var a;
var b;

// BUG 843490
a = b; // should be error?
b = a; // should be error?
