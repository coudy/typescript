// this should be an error
var x;

function func(k) {
}
;
func(x);

// this shouldn't be an error
var bar = 3;
var bar1;
