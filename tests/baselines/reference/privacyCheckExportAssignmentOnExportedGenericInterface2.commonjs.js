

function Foo(array) {
    return undefined;
}

var Foo;
(function (Foo) {
    Foo.x = "hello";
})(Foo || (Foo = {}));
module.exports = Foo;

