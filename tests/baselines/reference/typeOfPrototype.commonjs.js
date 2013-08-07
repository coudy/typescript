// bug 755692: Type of prototype should be same as constructor function
var Foo = (function () {
    function Foo() {
        this.bar = 3;
    }
    Foo.bar = '';
    return Foo;
})();
Foo.prototype.bar = undefined;
