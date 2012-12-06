///<reference path='References.ts' />
///<reference path='..\compiler\parser.ts' />
///<reference path='Test262.ts' />

var stringTable = new StringTable();

var specificFile = 
    // "7.6.1-4-1.js"; 
    undefined;

class Program {
    runAllTests(environment: IEnvironment, useTypeScript: bool, verify: bool): void {
        environment.standardOut.WriteLine("");

        environment.standardOut.WriteLine("Testing scanner.");
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript5",
            filePath => this.runScanner(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify));
            
        environment.standardOut.WriteLine("Testing parser.");
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript5",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify, /*allowErrors:*/ true));
            
        environment.standardOut.WriteLine("Testing against monoco.");
        this.runTests(environment, "C:\\temp\\monoco-files",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify: */ false, /*allowErrors:*/ false));
            
        //environment.standardOut.WriteLine("Testing against 262.");
        //this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\test262",
        //    filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify: */ false, /*allowErrors:*/ true, /*generateBaselines:*/ false));
    }

    private runTests(
        environment: IEnvironment,
        path: string,
        action: (filePath: string) => void,
        printDots: bool = false) {

        var testFiles = environment.listFiles(path, null, { recursive: true });
        for (var index in testFiles) {
            if (printDots) {
                // environment.standardOut.Write(".");
            }

            var filePath = testFiles[index];

            try {
                action(filePath);
            }
            catch (e) {
                environment.standardOut.WriteLine("");
                if ((<string>e.message).indexOf(filePath) < 0) {
                    environment.standardOut.WriteLine("Exception: " + filePath + ": " + e.message);
                }
                else {
                    environment.standardOut.WriteLine(e.message);
                }
            }
        }
    }

    runParser(environment: IEnvironment,
              filePath: string,
              languageVersion: LanguageVersion,
              useTypeScript: bool,
              verify: bool,
              allowErrors: bool,
              generateBaseline?: bool = false): void {
        if (!StringUtilities.endsWith(filePath, ".ts") && !StringUtilities.endsWith(filePath, ".js")) {
            return;
        }

        if (filePath.indexOf("RealSource") >= 0) {
            return;
        }

        if (specificFile !== undefined && filePath.indexOf(specificFile) < 0) {
            return;
        }

        // environment.standardOut.WriteLine("Running Parser: " + filePath);
        var contents = environment.readFile(filePath, 'utf-8');
        
        var start: number, end: number;
        start = new Date().getTime();

        totalSize += contents.length;

        if (useTypeScript) {
            var text1 = new TypeScript.StringSourceText(contents);
            var parser1 = new TypeScript.Parser(); 
            parser1.errorRecovery = true;
            var unit1 = parser1.parse(text1, filePath, 0);
        }
        else {
            var text = new StringText(contents);
            var scanner = new Scanner(text, languageVersion, /* new StringTable() */ stringTable);
            var parser = new Parser(scanner);
            var unit = parser.parseSyntaxTree();

            if (!allowErrors) {
                if (unit.diagnostics() && unit.diagnostics().length) {
                    throw new Error("File had unexpected error!");
                }
            }

            if (generateBaseline) {
                var actualResult = JSON2.stringify(unit, null, 4);
                var expectedFile = filePath + ".expected";

                // environment.standardOut.WriteLine("Generating baseline for: " + filePath);
                environment.writeFile(expectedFile, actualResult, /*useUTF8:*/ true);
            }
            else if (verify) {
                var actualResult = JSON2.stringify(unit, null, 4);
                var expectedFile = filePath + ".expected";
                var actualFile = filePath + ".actual";

                var expectedResult = environment.readFile(expectedFile, 'utf-8');

                if (expectedResult !== actualResult) {
                    environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                    environment.writeFile(actualFile, actualResult, /*useUTF8:*/ true);
                }
            }
        }
        
        end = new Date().getTime();
        totalTime += (end - start);
    }

    runScanner(environment: IEnvironment, filePath: string, languageVersion: LanguageVersion, useTypeScript: bool, verify: bool): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        if (useTypeScript) {
            return;
        }

        if (specificFile !== undefined && filePath.indexOf(specificFile) < 0) {
            return;
        }

        // environment.standardOut.WriteLine("Running Scanner: " + filePath);

        var contents = environment.readFile(filePath, 'utf-8');

        var start: number, end: number;
        start = new Date().getTime();
        try {
            var text = new StringText(contents);
            var scanner = Scanner.create(text, languageVersion);

            var tokens: ISyntaxToken[] = [];
            var textArray: string[] = [];
            var diagnostics: SyntaxDiagnostic[] = [];

            while (true) {
                var token = scanner.scan(diagnostics);
                tokens.push(token);

                if (verify) {
                    var tokenText = token.text();
                    var tokenFullText = token.fullText(text);

                    textArray.push(tokenFullText);

                    if (tokenFullText.substr(token.start() - token.fullStart(), token.width()) !== tokenText) {
                        throw new Error("Token invariant broken!");
                    }
                }

                if (token.tokenKind === SyntaxKind.EndOfFileToken) {
                    break;
                }
            }

            if (verify) {
                var fullText = textArray.join("");

                if (contents !== fullText) {
                    throw new Error("Full text didn't match!");
                }

                var result = diagnostics.length === 0 ? <any>tokens : { diagnostics: diagnostics, tokens: tokens };

                var actualResult = JSON2.stringify(result, null, 4);
                var expectedFile = filePath + ".expected";
                var actualFile = filePath + ".actual";

                var expectedResult = environment.readFile(expectedFile, 'utf-8');

                if (expectedResult !== actualResult) {
                    environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                    environment.writeFile(actualFile, actualResult, true);
                }
            }
        }
        finally {
            end = new Date().getTime();
            totalTime += (end - start);
        }
    }

    run(environment: IEnvironment, useTypeScript: bool): void {
        environment.standardOut.WriteLine("Testing input files.");
        for (var index in environment.arguments) {
            var filePath: string = environment.arguments[index];

            this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify:*/ false, /*allowErrors:*/ false);
        }
    }

    run262(environment: IEnvironment, useTypeScript: bool): void {
        var path = "C:\\temp\\test262\\suite";
        var testFiles = environment.listFiles(path, null, { recursive: true });

        var testCount = 0;
        var failCount = 0;
        var skippedTests:string[] = [];

        for (var index in testFiles) {
            var filePath: string = testFiles[index];

            // All 262 files are utf8.  But they dont' have a BOM.  Force them to be read in
            // as UTF8.
            var contents = environment.readFile(filePath, 'utf-8');

            var start: number, end: number;
            start = new Date().getTime();

            try {
                totalSize += contents.length;
                var isNegative = contents.indexOf("@negative") >= 0

                testCount++;

                var stringText = new StringText(contents);
                var scanner = new Scanner(stringText, LanguageVersion.EcmaScript5, stringTable);
                var parser = new Parser(scanner);

                var syntaxTree = parser.parseSyntaxTree();
            //environment.standardOut.Write(".");

                if (isNegative) {
                    var fileName = filePath.substr(filePath.lastIndexOf("\\") + 1);
                    var canParseSuccessfully = <bool>negative262ExpectedResults[fileName];

                    if (canParseSuccessfully) {
                        // We expected to parse this successfully.  Report an error if we didn't.
                        if (syntaxTree.diagnostics() && syntaxTree.diagnostics().length > 0) {
                            environment.standardOut.WriteLine("Negative test. Unexpected failure: " + filePath);
                            failCount++;
                        }
                    }
                    else {
                        // We expected to fail on this.  Report an error if we don't.
                        if (syntaxTree.diagnostics() === null || syntaxTree.diagnostics().length === 0) {
                            environment.standardOut.WriteLine("Negative test. Unexpected success: " + filePath);
                            failCount++;
                        }
                    }
                }
                else {
                    // Not a negative test.  We can't have any errors or skipped tokens.
                    if (syntaxTree.diagnostics() && syntaxTree.diagnostics().length > 0) {
                        environment.standardOut.WriteLine("Unexpected failure: " + filePath);
                        failCount++;
                    }
                }
            }
            catch (e) {
                failCount++;
                environment.standardOut.WriteLine("Exception: " + filePath);
            }
            finally {
                end = new Date().getTime();
                totalTime += (end - start);
            }
        }

        environment.standardOut.WriteLine("");
        environment.standardOut.WriteLine("Test 262 results:");
        environment.standardOut.WriteLine("Test Count: " + testCount);
        environment.standardOut.WriteLine("Skip Count: " + skippedTests.length);
        environment.standardOut.WriteLine("Fail Count: " + failCount);

        for (var i = 0; i < skippedTests.length; i++) {
            environment.standardOut.WriteLine(skippedTests[i]);
        }
    }
}

// (<any>WScript).StdIn.ReadLine();
var totalSize = 0;
var totalTime = 0;
var program = new Program();

// New parser.
if (true) {
    totalTime = 0;
    totalSize = 0;
    program.runAllTests(Environment, false, true);
    program.run(Environment, false);
    Environment.standardOut.WriteLine("Total time: " + totalTime);
    Environment.standardOut.WriteLine("Total size: " + totalSize);
}

// Existing parser.
if (true) {
    totalTime = 0;
    totalSize = 0;
    program.runAllTests(Environment, true, false);
    program.run(Environment, true);
    Environment.standardOut.WriteLine("Total time: " + totalTime);
    Environment.standardOut.WriteLine("Total size: " + totalSize);
}

// Test 262.
if (true && specificFile === undefined) {
    totalTime = 0;
    totalSize = 0;
    program.run262(Environment, false);
    Environment.standardOut.WriteLine("Total time: " + totalTime);
    Environment.standardOut.WriteLine("Total size: " + totalSize);
}