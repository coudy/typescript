// @declaration: true

module m {
    export class Foo {
        public c = 10;
    }
    declare export function (): Foo;
    export var d = 10;
    declare export function new (): string;
}

var x = m();
declare function (): any;
var newedVal = new m();