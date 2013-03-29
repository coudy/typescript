// @declaration: true
class C<T> { private x: T; }
interface X { f(): string; }
interface Y { f(): bool; }
var a: C<X>;
var b: C<Y>;
