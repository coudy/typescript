// bug 755692: Type of prototype should be same as constructor function

class Foo {
    bar = 3;
    static bar = '';
}
Foo.prototype.bar = undefined; // Should be OK
