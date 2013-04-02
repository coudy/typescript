var a = +1;
var b = +("");
var E;
(function (E) {
    E._map = [];
    E._map[0] = "some";
    E.some = 0;
    E._map[1] = "thing";
    E.thing = 1;
})(E || (E = {}));

var c = +E.some;
var x = +"3";
var y = -"3";
var z = ~"3";