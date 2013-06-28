///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling tests\\cases\\unittests\\compiler\\thisKeyword.ts', function() {
    var typeFactory = new Harness.Compiler.TypeFactory();
    it('this inside static methods of a class is constructor type', function () {
        assert.equal(typeFactory.get('class foo { static x = 3; static bar() { return this.x; } } var x = foo.bar();', 'x').type, 'number');
    });
    it('this inside functions of a module is any', function () {
        assert.equal(typeFactory.get('module bar { export function bar() { return this; } } var z = bar.bar();', 'z').type, 'any');
    });
});


