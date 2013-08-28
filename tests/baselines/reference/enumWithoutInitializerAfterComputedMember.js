var E;
(function (E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = E.a] = "b";
    E[E["c"] = null] = "c";
})(E || (E = {}));
