declare module "foo" {
    class Foo {
        x: Foo.Bar;
    }
    module Foo {
        export interface Bar {
        }
    }
    export = Foo;
}

import Foo = require('foo');

var z: Foo.Bar;
var zz: Foo;
zz.x;