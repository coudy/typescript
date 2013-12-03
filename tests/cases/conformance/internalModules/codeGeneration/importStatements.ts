module A {
    export class Point {
        constructor(public x: number, public y: number) { }
    }

    export var Origin = new Point(0, 0);
}

// no code gen expected
module B {
    import a = A; //Error
}

// no code gen expected
module C {
    import a = A; //Error
    var m: typeof a;
    var p: a.Point;
    var p = {x:0, y:0 };
}

// code gen expected
module D {
    import a = A;

    var p = new a.Point(1, 1);
}

module E {
    import a = A;
    export function xDist(x: a.Point) {
        return (a.Origin.x - x.x);
    }
}