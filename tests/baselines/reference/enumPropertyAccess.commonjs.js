var Colors;
(function (Colors) {
    Colors[Colors["Red"] = 0] = "Red";
    Colors[Colors["Green"] = 1] = "Green";
})(Colors || (Colors = {}));

var x = Colors.Red;
var p = x.Green;
x.toFixed();

// Now with generics
function fill(f) {
    f.Green;
    f.toFixed();
}
