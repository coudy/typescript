// some complex cases of assignment compat of generic signatures that stress contextual signature instantiation

var x;
var y;

x = y;

// BUG 780917
y = x;
