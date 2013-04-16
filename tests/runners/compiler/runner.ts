/// <reference path='..\..\..\src\harness\harness.ts' />
/// <reference path='..\..\..\src\compiler\diagnostics.ts' />
/// <reference path='..\runnerbase.ts' />

class CompilerBaselineRunner extends RunnerBase {

    private basePath = 'tests/cases';
    private errors;
    private emit;
    private decl;
    private output;

    public options: string;

    constructor(public testType?: string) {
        super(testType);
        this.errors = true;
        this.emit = true;
        this.decl = true;
        this.output = true;
        this.basePath += '/compiler';
    }

    // the compiler flags which we support and functions to set the right settings
    // Every flag here needs to also be present in the fileMetadataNames array in the TestCaseParser class in harness.ts. They must be all lowercase in both places.
    private supportedFlags: { flag: string; setFlag: (x: TypeScript.CompilationSettings, value: string) => void; }[] = [
        { flag: 'comments', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.emitComments = value.toLowerCase() === 'true' ? true : false; } },
        { flag: 'declaration', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.generateDeclarationFiles = value.toLowerCase() === 'true' ? true : false; } },
        {
            flag: 'module', setFlag: (x: TypeScript.CompilationSettings, value: string) => {
                switch (value.toLowerCase()) {
                    // this needs to be set on the global variable
                    case 'amd':
                        x.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
                        break;
                    case 'commonjs':
                        x.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
                        break;
                    default:
                        x.moduleGenTarget = TypeScript.ModuleGenTarget.Local;
                        break;
                }
            }
        },
        { flag: 'nolib', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.useDefaultLib = value.toLowerCase() === 'true' ? true : false; } },
        { flag: 'sourcemap', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.mapSourceFiles = value.toLowerCase() === 'true' ? true : false; } },
        { flag: 'target', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.codeGenTarget = value.toLowerCase() === 'es3' ? TypeScript.LanguageVersion.EcmaScript3 : TypeScript.LanguageVersion.EcmaScript5; } },
        { flag: 'out', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.outputOption = value; } },
        { flag: 'filename', setFlag: (x: TypeScript.CompilationSettings, value: string) => { /* used for multifile tests, doesn't change any compiler settings */; } },
    ];

    public checkTestCodeOutput(fileName: string) {
        var that = this;
        function setSettings(tcSettings: Harness.TestCaseParser.CompilerSetting[], settings: TypeScript.CompilationSettings) {
            tcSettings.forEach((item) => {
                var idx = that.supportedFlags.filter((x) => x.flag === item.flag.toLowerCase());
                if (idx && idx.length != 1) {
                    throw new Error('Unsupported flag \'' + item.flag + '\'');
                }

                idx[0].setFlag(settings, item.value);
            });
        }

        // strips the fileName from the path.
        var justName = fileName.replace(/^.*[\\\/]/, '');
        var content = IO.readFile(fileName);
        var testCaseContent = Harness.TestCaseParser.makeUnitsFromTest(content, justName);

        var units = testCaseContent.testUnitData;
        var tcSettings = testCaseContent.settings;

        var lastUnit = units[units.length - 1];
        describe('JS output and errors for ' + fileName, function () {
            assert.bugs(content);

            var jsOutputAsync = '';
            var jsOutputSync = '';

            var declFileName = TypeScript.isDTSFile(lastUnit.name) ? lastUnit.name : lastUnit.name.replace('.ts', '.d.ts');
            var declFileCode = '';

            var errorDescriptionAsync = '';
            var errorDescriptionLocal = '';

            // compile as CommonJS module                    
            Harness.Compiler.compileUnits(units, function (result) {
                for (var i = 0; i < result.errors.length; i++) {
                    errorDescriptionLocal += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                }
                jsOutputSync = result.code;

                // save away any generated .d.ts code for later verification
                result.fileResults.forEach(r => {
                    if (r.fileName === declFileName) {
                        declFileCode = r.file.lines.join('\n');
                    }
                });
            }, function (settings?: TypeScript.CompilationSettings) {
                tcSettings.push({ flag: "module", value: "commonjs" });
                setSettings(tcSettings, settings);
            });

            // compile as AMD module
            Harness.Compiler.compileUnits(units, function (result) {
                for (var i = 0; i < result.errors.length; i++) {
                    errorDescriptionAsync += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                }
                jsOutputAsync = result.code;
            }, function (settings?: TypeScript.CompilationSettings) {
                tcSettings.push({ flag: "module", value: "amd" });
                setSettings(tcSettings, settings);
            });

            // check errors
            if (that.errors) {
                Harness.Baseline.runBaseline('Correct errors for ' + fileName + ' (commonjs)', justName.replace(/\.ts/, '.errors.txt'), () => {
                    if (errorDescriptionLocal === '') {
                        return null;
                    } else {
                        return errorDescriptionLocal;
                    }
                });
            }

            // if the .d.ts is non-empty, confirm it compiles correctly as well
            if (that.decl && declFileCode) {
                var declErrors = '';
                // For single file tests we don't want the baseline file to be named 0.d.ts
                var realDeclName = (lastUnit.name === '0.ts') ? justName.replace('.ts', '.d.ts') : declFileName;
                // For multi-file tests we need to include their dependencies in case the .d.ts has an import so just fix up a new lastUnit
                var newLastUnit = {
                    content: declFileCode,
                    name: realDeclName,
                    fileOptions: lastUnit.fileOptions,
                    originalFilePath: lastUnit.originalFilePath,
                    references: lastUnit.references
                };
                var newUnits = units.slice(0, units.length - 1).concat([newLastUnit]);
                
                Harness.Compiler.compileUnits(newUnits, function (result) {
                    for (var i = 0; i < result.errors.length; i++) {
                        declErrors += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                    }
                });

                Harness.Baseline.runBaseline('.d.ts for ' + fileName + ' compiles without error', realDeclName.replace(/\.ts/, '.errors.txt'), () => {
                    return (declErrors === '') ? null : declErrors;
                });

                //Harness.Baseline.runBaseline('.d.ts for ' + fileName + ' matches the baseline', realDeclName, () => {
                //    return declFileCode;
                //});
            }

            if (!TypeScript.isDTSFile(lastUnit.name)) {
                if (that.emit) {
                    // check js output
                    Harness.Baseline.runBaseline('Correct JS output (commonjs) for ' + fileName, justName.replace(/\.ts/, '.commonjs.js'), () => {
                        return jsOutputSync;
                    });

                    Harness.Baseline.runBaseline('Correct JS output (AMD) for ' + fileName, justName.replace(/\.ts/, '.amd.js'), () => {
                        return jsOutputAsync;
                    });
                }

                if (that.output) {
                    // check runtime output
                    Harness.Baseline.runBaseline('Correct runtime output for ' + fileName, justName.replace(/\.ts/, '.output.txt'), () => {
                        var runResult = null;
                        Harness.Runner.runJSString(jsOutputSync, (error, result) => {
                            if (error === null) {
                                runResult = result;
                            }
                        });

                        if (typeof runResult === 'string') {
                            // Some interesting runtime result to report
                            return runResult;
                        } else {
                            return null;
                        }
                    });
                }
            }
        });
    }

    public runTests() {
        Harness.Compiler.recreate()

        this.parseOptions();

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