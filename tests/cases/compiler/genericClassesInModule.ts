// @declaration: true
//bug 719806: invalid declare file


module Foo {

    export class B<T>{ }

    export class A { }
}

var a = new Foo.B<Foo.A>();