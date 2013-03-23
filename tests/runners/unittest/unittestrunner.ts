///<reference path="../../../src/harness/harness.ts" />
///<reference path="../runnerbase.ts" />

class UnitTestRunner extends RunnerBase {

    constructor(public testType?: string) {
        super(testType);
    }

    public runTests() {
        switch (this.testType) {
            case 'compiler':
                this.tests = this.enumerateFiles('tests/cases/unittests/compiler');
                break;
            case 'ls':
                this.tests = this.enumerateFiles('tests/cases/unittests/ls');
                break;
            case 'services':
                this.tests = this.enumerateFiles('tests/cases/unittests/services');
                break;
            case 'harness':
                this.tests = this.enumerateFiles('tests/cases/unittests/harness');
                break;
            case 'samples':
                this.tests = this.enumerateFiles('tests/cases/unittests/samples');
                break;
            default:
                if (this.tests.length === 0) {
                    throw new Error('Unsupported test cases: ' + this.testType);
                }
                break;
        }

        var outfile = new Harness.Compiler.WriterAggregator()
        var outerr = new Harness.Compiler.WriterAggregator();

        Harness.Compiler.recreate();

        for (var i = 0; i < this.tests.length; i++) {
            try {
                Harness.Compiler.addUnit(IO.readFile(this.tests[i]), this.tests[i]);
            } catch (e) {
                IO.printLine('FATAL ERROR COMPILING TEST: ' + this.tests[i]);
                throw e;
            }
        }

        Harness.Compiler.compile();
        
        var stdout = new Harness.Compiler.EmitterIOHost();
        var emitDiagnostics = Harness.Compiler.emit(stdout);
        var results = stdout.toArray();
        var lines = [];
        results.forEach(v => lines = lines.concat(v.file.lines));
        var code = lines.join("\n")
        //Harness.Compiler.emitToOutfile(outfile);
        //code = outfile.lines.join("\n") + ";";

        if (typeof require !== "undefined") {
            var vm = require('vm');
            vm.runInNewContext(code,
                {
                    require: require,
                    TypeScript: TypeScript,
                    process: process,
                    describe: describe,
                    it: it,
                    assert: assert,
                    Harness: Harness,
                    IO: IO,
                    Exec: Exec,
                    Services: Services,
                    DumpAST: DumpAST,
                    // Formatting: Formatting,
                    Diff: Diff,
                    FourSlash: FourSlash
                },
                "generated_test_code.js"
            );
        } else {
            eval(code);
        }

        // clean up 
        Harness.Compiler.recreate();
    }
}