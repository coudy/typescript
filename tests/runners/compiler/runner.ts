/// <reference path='..\..\..\src\harness\harness.ts' />
/// <reference path='..\..\..\src\compiler\diagnostics.ts' />
/// <reference path='..\runnerbase.ts' />

class CompilerBaselineRunner extends RunnerBase {

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
    { flag: 'filename', setFlag: (x: TypeScript.CompilationSettings, value: string) => { /* used for multifile tests, doesn't change any settings */; } },
    ];

    public checkTestCodeOutput(filename: string) {

        function setSettings(tcSettings: Harness.TestCaseParser.CompilerSetting[], settings: TypeScript.CompilationSettings) {

            tcSettings.forEach((item) => {
                var idx = this.supportedFlags.filter((x) => x.flag === item.flag.toLowerCase());
                if (idx && idx.length != 1) {
                    throw new Error('Unsupported flag \'' + item.flag + '\'');
                }

                idx[0].setFlag(settings, item.value);
            });
        }

        var basePath = 'tests/cases/compiler/';
        // strips the filename from the path.
        var justName = filename.replace(/^.*[\\\/]/, '');
        var content = IO.readFile(filename);
        var testCaseContent = Harness.TestCaseParser.makeUnitsFromTest(content, justName);

        var units = testCaseContent.testUnitData;
        var tcSettings = testCaseContent.settings;

        units.forEach(unit => {
            describe('JS output and errors for ' + unit.name, function () {
                assert.bugs(content);

                var jsOutputAsync = '';
                var jsOutputSync = '';
                
                var declFileName = Harness.Compiler.isDeclareFile(unit.name) ? unit.name : unit.name.replace('.ts', '.d.ts');
                var declFileCode = '';

                var errorDescriptionAsync = '';
                var errorDescriptionLocal = '';

                // TODO: Can we do this using just in memory files 
                var isMultiFileTest = units.length > 1;
                var tempFilePath = basePath + unit.name;
                if (isMultiFileTest) {
                    IO.writeFile(tempFilePath, unit.content);
                }

                var unitIdx = units.indexOf(unit);
                var dependencies = units.slice(0, unitIdx);
                var compilationContext = Harness.Compiler.defineCompilationContextForTest(unit.name, dependencies, basePath);

                // compile as CommonJS module
                var unitPath = basePath + unit.name;
                
                Harness.Compiler.compileFile(unitPath, function (result) {
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
                    setSettings(tcSettings, settings);
                    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
                }, compilationContext, unit.references);

                // compile as AMD module
                Harness.Compiler.compileFile(unitPath, function (result) {
                    for (var i = 0; i < result.errors.length; i++) {
                        errorDescriptionAsync += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                    }
                    jsOutputAsync = result.code;
                }, function (settings?: TypeScript.CompilationSettings) {
                    setSettings(tcSettings, settings);
                    TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
                }, compilationContext, unit.references);

                // check errors
                Harness.Baseline.runBaseline('Correct errors for ' + unit.name + ' (local)', unit.name.replace(/\.ts/, '.errors.txt'), () => {
                    if (errorDescriptionLocal === '') {
                        return null;
                    } else {
                        return errorDescriptionLocal;
                    }
                });

                // if the .d.ts is non-empty, confirm it compiles correctly as well
                if(!declFileCode) {
                    var declErrors = '';
                    Harness.Compiler.compileString(declFileCode, declFileName, function (result) {
                        for (var i = 0; i < result.errors.length; i++) {
                            declErrors += result.errors[i].file + ' line ' + result.errors[i].line + ' col ' + result.errors[i].column + ': ' + result.errors[i].message + '\r\n';
                        }
                    });

                    Harness.Baseline.runBaseline('.d.ts for ' + filename + ' compiles without error', declFileName.replace(/\.ts/, '.errors.txt'), () => {
                        return (declErrors === '') ? null : declErrors;
                    });
                }

                if (!Harness.Compiler.isDeclareFile(unit.name)) {
                    // check js output
                    Harness.Baseline.runBaseline('Correct JS output (commonjs) for ' + unit.name, unit.name.replace(/\.ts/, '.commonjs.js'), () => {
                        return jsOutputSync;
                    });

                    Harness.Baseline.runBaseline('Correct JS output (AMD) for ' + unit.name, unit.name.replace(/\.ts/, '.amd.js'), () => {
                        return jsOutputAsync;
                    });

                    // check runtime output
                    Harness.Baseline.runBaseline('Correct runtime output for ' + unit.name, unit.name.replace(/\.ts/, '.output.txt'), () => {
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

                if (isMultiFileTest) {
                    IO.deleteFile(tempFilePath);
                }
            });
        });
    }

    public runTests() {
        Harness.Compiler.recreate()

        if (this.tests.length === 0) {
            this.enumerateFiles('tests/cases/compiler').forEach(fn => {
                fn = fn.replace(/\\/g, "/");
                this.checkTestCodeOutput(fn);
            });
        }
        else {
            this.tests.forEach(test => this.checkTestCodeOutput(test));
        }
    }
}