///<reference path='..\..\..\..\src\harness\harness.ts'/>

describe("Assignment compatibility Sanity Check", function() {
    var typeFactory = new Harness.Compiler.TypeFactory();
    var singleObj1 = typeFactory.get('var x: {one: number}', 'x');
    var singleObj2 = typeFactory.get('var y: {[index:number]: number}', 'y');

    describe("basic test", function () {
        it("assert not assignment compatible with", function () {
            singleObj1.assertAssignmentCompatibleWith([singleObj2]);
        });
    });
});

