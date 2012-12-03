///<reference path='References.ts' />
///<reference path='..\compiler\parser.ts' />

var stringTable = new StringTable();

class Program {
    runAllTests(environment: IEnvironment, useTypeScript: bool, verify: bool): void {
        environment.standardOut.WriteLine("");

        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript5",
            filePath => this.runScanner(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify));
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript3",
            filePath => this.runScanner(environment, filePath, LanguageVersion.EcmaScript3, useTypeScript, verify));
            
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript5",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify, /*allowErrors:*/ true));
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript3",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript3, useTypeScript, verify, /*allowErrors:*/ true));

        this.runTests(environment, "C:\\temp\\monoco-files",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify: */ false, /*allowErrors:*/ false));

        environment.standardOut.WriteLine("");
    }

    private runTests(
        environment: IEnvironment,
        path: string,
        action: (filePath: string) => void) {

        var testFiles = environment.listFiles(path, null, { recursive: true });
        for (var index in testFiles) {
            var filePath = testFiles[index];

            try {
                action(filePath);
            }
            catch (e) {
                environment.standardOut.WriteLine("Exception: " + filePath);
            }
        }
    }

    runParser(environment: IEnvironment,
              filePath: string,
              languageVersion: LanguageVersion,
              useTypeScript: bool,
              verify: bool,
              allowErrors: bool): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        if (filePath.indexOf("RealSource") >= 0) {
            return;
        }

        if (filePath.indexOf("ErrorRecovery_ObjectLiteral2.ts") < 0) {
            // return;
        }

        // environment.standardOut.WriteLine("Running Parser: " + filePath);
        var contents = environment.readFile(filePath);
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

            // var json = JSON2.stringify(unit);
            
            if (verify) {
                var actualResult = JSON2.stringify(unit, null, 4);
                var expectedFile = filePath + ".expected";
                var actualFile = filePath + ".actual";

                var expectedResult = environment.readFile(expectedFile);

                if (expectedResult !== actualResult) {
                    environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                    environment.writeFile(actualFile, actualResult);
                }
            }
        }
    }

    runScanner(environment: IEnvironment, filePath: string, languageVersion: LanguageVersion, useTypeScript: bool, verify: bool): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        if (useTypeScript) {
            return;
        }

        // environment.standardOut.WriteLine("Running Scanner: " + filePath);

        var contents = environment.readFile(filePath);
        var text = new StringText(contents);
        var scanner = Scanner.create(text, languageVersion);

        var tokens: ISyntaxToken[] = [];
        var textArray: string[] = [];

        while (true) {
            var token = scanner.scan();
            tokens.push(token);
            
            if (verify) {
                if (token.diagnostics()) {
                    // throw new Error("Error parsing!");
                }

                var tokenText = token.text();
                var tokenFullText = token.fullText(text);

                textArray.push(tokenFullText);

                if (tokenFullText.substr(token.start() - token.fullStart(), token.width()) !== tokenText) {
                    throw new Error("Token invariant broken!");
                }
            }

            if (token.kind === SyntaxKind.EndOfFileToken) {
                break;
            }
        }

        if (verify) {
            var fullText = textArray.join("");

            if (contents !== fullText) {
                throw new Error("Full text didn't match!");
            }
        
            var actualResult = JSON2.stringify(tokens, null, 4);
            var expectedFile = filePath + ".expected";
            var actualFile = filePath + ".actual";

            var expectedResult = environment.readFile(expectedFile);

            if (expectedResult !== actualResult) {
                environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                environment.writeFile(actualFile, actualResult);
            }
        }
    }

    run(environment: IEnvironment, useTypeScript: bool): void {
        for (var index in environment.arguments) {
            var filePath: string = environment.arguments[index];

            this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify:*/ false, /*allowErrors:*/ false);
        }
    }
}

// (<any>WScript).StdIn.ReadLine();
var totalSize = 0;
var program = new Program();
var start: number, end: number;

start = new Date().getTime();
program.runAllTests(Environment, false, true);
program.run(Environment, false);
end = new Date().getTime();
Environment.standardOut.WriteLine("Total time: " + (end - start));
Environment.standardOut.WriteLine("Total size: " + totalSize);

start = new Date().getTime();
program.runAllTests(Environment, true, false);
program.run(Environment, true);
end = new Date().getTime();
Environment.standardOut.WriteLine("Total time: " + (end - start));