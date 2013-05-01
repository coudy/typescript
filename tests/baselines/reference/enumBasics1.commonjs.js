var E;
(function (E) {
    E._map = [];
    E.A = 1;
    E._map[2] = "B";
    E.B = 2;
    E._map[3] = "C";
    E.C = 3;
})(E || (E = {}));

E.A.A;

var E2;
(function (E2) {
    E2._map = [];
    E2._map[0] = "A";
    E2.A = 0;
    E2._map[1] = "B";
    E2.B = 1;
})(E2 || (E2 = {}));

var E2;
(function (E2) {
    E2._map = [];
    E2._map[0] = "C";
    E2.C = 0;
    E2._map[1] = "D";
    E2.D = 1;
})(E2 || (E2 = {}));