var c;
(function (c) {
    
    c.x;
})(c || (c = {}));

////[0.d.ts]
declare module a {
    interface I {
    }
}
declare module c {
    var x: a.I;
}
