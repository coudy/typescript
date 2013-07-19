// bug 728545: No error for duplicate properties when one is a string named property
var x;
x[1] = 4;
x['1'] = 4;

var y;
y['1'] = 4;
y[1] = 4;// should be error (bug 728545)

