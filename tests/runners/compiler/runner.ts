/// <reference path='..\..\..\src\harness\harness.ts' />
/// <reference path='..\..\..\src\compiler\diagnostics.ts' />
/// <reference path='..\runnerbase.ts' />

class CompilerBaselineRunner extends RunnerBase {

    private basePath = 'tests/cases';
    private errors;
    private emit;
    private decl;
    private output;
    private usepull;

    public options: string;

    constructor(public testType?: string) {
        super(testType);
        this.errors = true;
        this.emit = true;
        this.decl = true;
        this.output = true;
        this.usepull = false;

        if (testType === 'prototyping') {
            this.basePath += '/prototyping';
            this.usepull = true;
            Harness.usePull = true;
        }
        this.basePath += '/compiler';
    }

    // the compiler flags which we support and functions to set the right settings
    private supportedFlags: { flag: string; setFlag: (x: TypeScript.CompilationSettings, value: string) => void; }[] = [
    { flag: 'comments', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.emitComments = value.toLowerCase() === 'true' ? true : false; } },
    { flag: 'declaration', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.generateDeclarationFiles = value.toLowerCase() === 'true' ? true : false; } },
    {
        flag: 'module', setFlag: (x: TypeScript.CompilationSettings, value: string) => {
            switch (value.toLowerCase()) {
                // this needs to be set on the global variable
                case 'amd':
                    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
                    x.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
                    break;
                case 'commonjs':
                    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
                    x.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
                    break;
                default:
                    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Local;
                    x.moduleGenTarget = TypeScript.ModuleGenTarget.Local;
                    break;
            }
        }
    },
    { flag: 'nolib', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.useDefaultLib = value.toLowerCase() === 'true' ? true : false; } },
    { flag: 'sourcemap', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.mapSourceFiles = value.toLowerCase() === 'true' ? true : false; } },
    { flag: 'target', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.codeGenTarget = value.toLowerCase() === 'es3' ? TypeScript.CodeGenTarget.ES3 : TypeScript.CodeGenTarget.ES5; } },
    { flag: 'out', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.outputOption = value; } },
    { flag: 'filename', setFlag: (x: TypeScript.CompilationSettings, value: string) => { /* used for multifile tests, doesn't change any compiler settings */; } },
    { flag: 'usepull', setFlag: (x: TypeScript.CompilationSettings, value: string) => { x.usePull = value.toLowerCase() === 'true' ? true : false; } },
    ];

    public checkTestCodeOutput(filename: string) {
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

        // strips the filename from the path.
        var justName = filename.replace(/^.*[\\\/]/, '');
        var content = IO.readFile(filename);
        var testCaseContent = Harness.TestCaseParser.makeUnitsFromTest(content, justName);

        var units = testCaseContent.testUnitData;
        var tcSettings = testCaseContent.settings;

        var lastUnit = units[units.length - 1];
        describe('JS output and errors for ' + filename, function () {
            assert.bugs(content);

            var jsOutputAsync = '';
            var jsOutputSync = '';

            var declFileName = Harness.Compiler.isDeclareFile(lastUnit.name) ? lastUnit.name : lastUnit.name.replace('.ts', '.d.ts');
            var declFileCode = '';

            var errorDescriptionAsync = '';
            var errorDescriptionLocal = '';

            if (that.usepull) {
                tcSettings.push({ flag: 'usepull', value: 'true' });
            }

            // compile as CommonJS module                    
            Harness.Compiler.compileUnits(units, function (result) {
                for (var i = 0; i < result.errors.length; i++) {
                    errorDescriptionLocal += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                }
                jsOutputSync = result.code;

                // save away any generated .d.ts code for later verification
                result.fileResults.forEach(r => {
                    if (r.filename === declFileName) {
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
                Harness.Baseline.runBaseline('Correct errors for ' + filename + ' (commonjs)', justName.replace(/\.ts/, '.errors.txt'), () => {
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

                Harness.Baseline.runBaseline('.d.ts for ' + filename + ' compiles without error', realDeclName.replace(/\.ts/, '.errors.txt'), () => {
                    return (declErrors === '') ? null : declErrors;
                });

                //Harness.Baseline.runBaseline('.d.ts for ' + filename + ' matches the baseline', realDeclName, () => {
                //    return declFileCode;
                //});
            }

            if (!Harness.Compiler.isDeclareFile(lastUnit.name)) {
                if (that.emit) {
                    // check js output
                    Harness.Baseline.runBaseline('Correct JS output (commonjs) for ' + filename, justName.replace(/\.ts/, '.commonjs.js'), () => {
                        return jsOutputSync;
                    });

                    Harness.Baseline.runBaseline('Correct JS output (AMD) for ' + filename, justName.replace(/\.ts/, '.amd.js'), () => {
                        return jsOutputAsync;
                    });
                }

                if (that.output) {
                    // check runtime output
                    Harness.Baseline.runBaseline('Correct runtime output for ' + filename, justName.replace(/\.ts/, '.output.txt'), () => {
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