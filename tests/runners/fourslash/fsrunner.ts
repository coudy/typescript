///<reference path='..\..\..\src\harness\fourslash.ts' />
///<reference path='..\..\..\src\harness\harness.ts'/>
///<reference path='..\runnerbase.ts' />

class FourslashRunner extends RunnerBase {
    private basePath = 'tests/cases/';
    constructor(testType?: string) {
        super(testType);

        if (testType === 'prototyping') {
            this.basePath += 'prototyping/';
        }
        this.basePath += 'fourslash/';
    }

    public runTests() {
        var runSingleFourslashTest = (fn: string) => {
            var justName = fn.replace(/^.*[\\\/]/, '');

            if (!justName.match(/fourslash.ts$/i)) {
                describe('FourSlash test ' + justName, function () {
                    it('Runs correctly', function () {
                        FourSlash.runFourSlashTest(fn);
                    });
                });
            }
        }

        if (this.tests.length === 0) {
            this.tests = this.enumerateFiles(this.basePath);
        }

        Harness.Compiler.recreate();
        this.tests.forEach(runSingleFourslashTest);
    }
}

