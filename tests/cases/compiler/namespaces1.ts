// bug 736713: Module and interface with the same name cause error when accessing nested type

module X {
    export module Y {
        export interface Z { }
    }
    export interface Y { }
}

var x: X.Y.Z; // Should be ok (Bug 736713)
var x2: X.Y;