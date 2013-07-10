var x = 1;
// BUG 733914
var x = 2; 

function f() {
    var y = 1;
    var y = 2;
}

function f2() {
    var z = 3;
    var z = "";
}