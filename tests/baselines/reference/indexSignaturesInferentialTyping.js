function foo(items) {
    return undefined;
}
function bar(items) {
    return undefined;
}

var x1 = foo({ 0: 0, 1: 1 });
var x2 = foo({ zero: 0, one: 1 });
var x3 = bar({ 0: 0, 1: 1 });
var x4 = bar({ zero: 0, one: 1 });
