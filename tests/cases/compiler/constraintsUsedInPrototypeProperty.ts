class Foo<T extends number, U, V extends string> { }
Foo.prototype; // Foo<number, {}, string>