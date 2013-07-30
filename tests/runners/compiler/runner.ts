/// <reference path='..\..\..\src\harness\harness.ts' />
/// <reference path='..\..\..\src\compiler\diagnostics.ts' />
/// <reference path='..\runnerbase.ts' />

class CompilerBaselineRunner extends RunnerBase {

    private basePath = 'tests/cases';
    private errors: boolean;
    private emit: boolean;
    private decl: boolean;
    private output: boolean;

    public options: string;

    constructor(public testType?: string) {
        super(testType);
        this.errors = true;
        this.emit = true;
        this.decl = true;
        this.output = true;
        this.basePath += '/compiler';
    }    

    public checkTestCodeOutput(fileName: string) {
        // strips the fileName from the path.
        var justName = fileName.replace(/^.*[\\\/]/, '');
        var content = IO.readFile(fileName).contents;
        var testCaseContent = Harness.TestCaseParser.makeUnitsFromTest(content, fileName);

        var units = testCaseContent.testUnitData;
        var tcSettings = testCaseContent.settings;
        var createNewInstance = false;

        var lastUnit = units[units.length - 1];

        describe('JS output and errors for ' + fileName, () => {
            Harness.Assert.bugs(content);

            var jsOutputAsync = '';
            var jsOutputSync = '';

            var declFilesCode: { fileName: string; code: string; }[] = []

            var errorDescriptionAsync = '';
            var errorDescriptionLocal = '';
            var createNewInstance = false;

            var harnessCompiler = Harness.Compiler.getCompiler(Harness.Compiler.CompilerInstance.RunTime);
            // The compiler doesn't handle certain flags flipping during a single compilation setting. Tests on these flags will need 
            // a fresh compiler instance for themselves and then create a fresh one for the next test. Would be nice to get dev fixes
            // eventually to remove this limitation.
            for (var i = 0; i < tcSettings.length; ++i) {
                if (tcSettings[i].flag == "noimplicitany" || tcSettings[i].flag === "target") {
                    Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime, true /*minimalDefaultLife */, true /*noImplicitAny*/);
                    harnessCompiler.setCompilerSettings(tcSettings);
                    createNewInstance = true;
                    break;
                }
            }

            var toBeCompiled = units.map(unit => {
                return { unitName: 'tests/cases/compiler/' + unit.name, content: unit.content };
            });
            harnessCompiler.compileFiles(toBeCompiled, function (result) {
                var jsResult = result.commonJS;
                for (var i = 0; i < jsResult.errors.length; i++) {
                    errorDescriptionLocal += Harness.getFileName(jsResult.errors[i].file) + ' line ' + jsResult.errors[i].line + ' col ' + jsResult.errors[i].column + ': ' + jsResult.errors[i].message + '\r\n';
                }
                jsOutputSync = jsResult.code;

                // AMD output
                var amdResult = result.amd;
                for (var i = 0; i < amdResult.errors.length; i++) {
                    errorDescriptionAsync += Harness.getFileName(amdResult.errors[i].file) + ' line ' + amdResult.errors[i].line + ' col ' + amdResult.errors[i].column + ': ' + amdResult.errors[i].message + '\r\n';
                }
                jsOutputAsync = amdResult.code;

                declFilesCode = result.commonJS.declFilesCode;
            }, function (settings?: TypeScript.CompilationSettings) {
                tcSettings.push({ flag: "module", value: "commonjs" });
                harnessCompiler.setCompilerSettings(tcSettings);
            });

            // check errors
            if (this.errors) {
                Harness.Baseline.runBaseline('Correct errors for ' + fileName + ' (commonjs)', justName.replace(/\.ts/, '.errors.txt'), () => {
                    if (errorDescriptionLocal === '') {
                        return null;
                    } else {
                        // Certain errors result in full paths being reported, namely when types of external modules are involved
                        // we'll strip the full path and just report the filename
                        var fullPath = /\w+:(\/|\\)(\w+|\/)*\.ts/g;
                        var hasFullPath = errorDescriptionLocal.match(fullPath);
                        if (hasFullPath) {
                            hasFullPath.forEach(match => {
                                var filename = Harness.getFileName(match);
                                errorDescriptionLocal = errorDescriptionLocal.replace(match, filename);
                                errorDescriptionAsync = errorDescriptionAsync.replace(match, filename); // should be the same errors
                            });
                        }
                        return errorDescriptionLocal;
                    }
                });
            }

            // if the .d.ts is non-empty, confirm it compiles correctly as well
            if (this.decl && declFilesCode) {
                var declErrors = '';
                declFilesCode.forEach(file => {
                    var declFile = { unitName: file.fileName, content: file.code };
                    harnessCompiler.compileFiles(
                        [declFile],
                        function (result) {
                            var jsOutputSync = result.commonJS;
                            for (var i = 0; i < jsOutputSync.errors.length; i++) {
                                declErrors += jsOutputSync.errors[i].file + ' line ' + jsOutputSync.errors[i].line + ' col ' + jsOutputSync.errors[i].column + ': ' + jsOutputSync.errors[i].message + '\r\n';
                            }
                        });

                    Harness.Baseline.runBaseline('.d.ts for ' + fileName + ' compiles without error', Harness.getFileName(file.fileName).replace(/\.ts/, '.errors.txt'), () => {
                        return (declErrors === '') ? null : declErrors;
                    });
                });
            }

            if (!TypeScript.isDTSFile(lastUnit.name)) {
                if (this.emit) {
                    // check js output
                    Harness.Baseline.runBaseline('Correct JS output (commonjs) for ' + fileName, justName.replace(/\.ts/, '.commonjs.js'), () => {
                        return jsOutputSync;
                    });

                    Harness.Baseline.runBaseline('Correct JS output (AMD) for ' + fileName, justName.replace(/\.ts/, '.amd.js'), () => {
                        return jsOutputAsync;
                    });
                }
            }
            if (createNewInstance) {
                Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime, true);
                createNewInstance = false;
            }
        });
    }

    public initializeTests() {       
        describe("Setup compiler for compiler baselines", () => {
            // REVIEW: would like to use the minimal lib.d.ts but a bunch of tests need to be converted to use non-DOM APIs
            Harness.Compiler.recreate(Harness.Compiler.CompilerInstance.RunTime, true);
            this.parseOptions();
        });

        if (this.tests.length === 0) {
            this.enumerateFiles(this.basePath).forEach(fn => {
                fn = fn.replace(/\\/g, "/");
                this.checkTestCodeOutput(fn);
            });
        }
        else {
            this.tests.forEach(test => this.checkTestCodeOutput(test));
        }
    }

    private parseOptions() {
        if (this.options && this.options.length > 0) {
            this.errors = false;
            this.emit = false;
            this.decl = false;
            this.output = false;

            var opts = this.options.split(',');
            for (var i = 0; i < opts.length; i++) {
                switch (opts[i]) {
                    case 'error':
                        this.errors = true;
                        break;
                    case 'emit':
                        this.emit = true;
                        break;
                    case 'decl':
                        this.decl = true;
                        break;
                    case 'output':
                        this.output = true;
                        break;
                    default:
                        throw new Error('unsupported flag');
                }
            }
        }
    }
}