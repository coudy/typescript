///<reference path='..\..\..\..\src\harness\harness.ts'/>

describe("Assignment compatibility", function() {
    var typeFactory = new Harness.Compiler.TypeFactory();

    var any     = typeFactory.any;
    var number  = typeFactory.number;
    var string  = typeFactory.string;
    var bool    = typeFactory.bool;

    // var anyArray     = typeFactory.get('var arr = []', 'arr');
    // var someFunction = typeFactory.get('function f() {}', 'f');
    // var someObject   = typeFactory.get('var obj = {one: 1}', 'obj');
    // var someClass    = typeFactory.get('class Foo {};', 'Foo');
    // var someInstance = typeFactory.get('class Foo {}; var f = new Foo();', 'f');

    var genericMapCode = "['a', 'b', 'c'].map(x => x.length);"

    var knockOutCode = 
        "declare module ko {" +
        "   export interface Observable<T> {" +
        "       (): T;" +
        "       (value: T): any;" +
        "       N: number;" +
        "       g: bool;" +
        "       r: T;" +
        "   }" +
        "   export function observable<T>(value: T): Observable<T>;" +
        "}" +
        "var o = {" +
        "   name: ko.observable(\"Bob\")," +
        "   age: ko.observable(37)" +
        "};" +
        "var x_v = o.name().length;" + // should be 'number'
        "var age_v = o.age();" + // should be 'number'
        "var name_v = o.name(\"Robert\");" + // should be 'any'
        "var zz_v = o.name.N;" + // should be 'number'
        "var yy_v = o.name.g;" + // should be 'bool'
        "var rr_v = o.name.r;" + // should be 'string'

    
    describe("Test generic array specialization and contextual typing", () => {
        typeFactory.isOfType(genericMapCode, "Array<number>");
    });

    describe("Test generic interface in modules (knockout)", () => {
        it("generic type flows through call 1", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("x_v"));
            t.assertIdenticalTo(number);
        });

        it("generic type flows through call 2", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("age_v"));
            t.assertIdenticalTo(number);
        });

        it("generic type flows through call 3", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("name_v"));
            t.assertIdenticalTo(any);
        });

        it("generic type flows through field 1", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("zz_v"));
            t.assertIdenticalTo(number);
        });

        it("generic type flows through field 2", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("yy_v"));
            t.assertIdenticalTo(bool);
        });

        it("generic type flows through field 3", function () {
            var t = typeFactory.get(knockOutCode, knockOutCode.indexOf("rr_v"));
            t.assertIdenticalTo(bool);
        });
    });

});
