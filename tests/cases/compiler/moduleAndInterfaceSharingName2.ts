// BUG 742098
module X {
    export module Y {
        export interface Z { }
    }
    export interface Y { }
}
var z: X.Y.Z = null; // error: 'The property "Z" does not exist on value of type "X.Y"'
var z2: X.Y<string>;