///<reference path='..\..\..\src\harness\fourslash.ts' />
///<reference path='..\runnerbase.ts' />

class FourslashRunner extends RunnerBase
{
    public runTests()
    {
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
            this.tests = this.enumerateFiles('tests/cases/fourslash');
        }
        
        this.tests.forEach(runSingleFourslashTest);
    }
}

