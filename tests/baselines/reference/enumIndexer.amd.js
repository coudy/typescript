// bug 755637: Return type from enum indexed with computed string not correct
var MyEnumType;
(function (MyEnumType) {
    MyEnumType[MyEnumType["foo"] = 0] = "foo";
    MyEnumType[MyEnumType["bar"] = 1] = "bar";
})(MyEnumType || (MyEnumType = {}));
var _arr = [{ key: 'foo' }, { key: 'bar' }];
var enumValue = MyEnumType.foo;
var x = _arr.map(function (o) {
    return MyEnumType[o.key] === enumValue;
});
