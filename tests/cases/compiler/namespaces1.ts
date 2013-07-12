module X {
    export module Y {
        export interface Z { }
    }
    export interface Y { }
}

var x: X.Y.Z; // Should be ok (Bug 736713)
var x2: X.Y;