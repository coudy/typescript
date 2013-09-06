//@module: commonjs
// @Filename: exportAssignClassAndModule_0.ts
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

// @Filename: exportAssignClassAndModule_1.ts
///<reference path='exportAssignClassAndModule_0.ts'/>
import Foo = require('foo');

var z: Foo.Bar;
var zz: Foo;
zz.x;