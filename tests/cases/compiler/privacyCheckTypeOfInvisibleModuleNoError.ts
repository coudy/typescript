// @declaration: true
module Outer {
    module Inner {
        export var m: number;
    }

    export var f: typeof Inner;
}
