///<reference path='References.ts' />

class Program {
    runTests(environment: IEnvironment): void {
        this.runScannerTests(environment);
    }

    runScannerTests(environment: IEnvironment): void {
        var testFiles = environment.listFiles("C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript5");
        for (var index in testFiles) {
            var filePath = testFiles[index];
            this.runScannerTest(environment, filePath, LanguageVersion.EcmaScript5);
        }
    }

    runScannerTest(environment: IEnvironment, filePath: string, languageVersion: LanguageVersion): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        environment.standardOut.WriteLine("Testing Scanner: " + filePath);

        var contents = environment.readFile(filePath);
        var text = new StringText(contents);
        var scanner = Scanner.create(text, languageVersion);

        var tokens = [];
        while (true) {
            var token = scanner.scan();

            tokens.push(token);
            if (token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }
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

    run(environment: IEnvironment): void {
        if (true) {
            for (var index in environment.arguments) {
                var filePath: string = environment.arguments[index];
                environment.standardOut.WriteLine("Parsing: " + filePath);

                this.runParser(environment, environment.readFile(filePath), filePath);
            }
        }

        for (var index in environment.arguments) {
            var filePath: string = environment.arguments[index];
            environment.standardOut.WriteLine("Tokenizing: " + filePath);

            this.runScanner(environment, environment.readFile(filePath));
        }
    }

    runParser(environment: IEnvironment, contents: string, filePath: string): void {
        var text = new StringText(contents);
        var scanner = Scanner.create(text, LanguageVersion.EcmaScript5);
        var parser = new Parser(scanner, null, null);

        if (StringUtilities.endsWith(filePath, ".ts")) {
            parser.parseSourceUnit();
        }
        else {
            environment.standardOut.WriteLine("skipping unknown file file.");
        }
    }

    runScanner(environment: IEnvironment, contents: string): void {
        var text = new StringText(contents);
        var scanner = Scanner.create(text, LanguageVersion.EcmaScript5);

        var tokens: ISyntaxToken[] = [];
        var textArray: string[] = [];

        while (true) {
            var token = scanner.scan();
            tokens.push(token);

            if (token.kind() === SyntaxKind.EndOfFileToken) {
                break;
            }

            if (token.diagnostics()) {
                throw new Error("Error parsing!");
            }

            var tokenText = token.text();
            var tokenFullText = token.fullText(text);

            textArray.push(tokenFullText);

            if (tokenFullText.substr(token.start() - token.fullStart(), token.width()) !== tokenText) {
                throw new Error("Token invariant broken!");
            }
        }

        environment.standardOut.WriteLine("Token Count: " + tokens.length);
        var fullText = textArray.join("");

        if (contents !== fullText) {
            throw new Error("Full text didn't match!");
        }
    }
}

var program = new Program();
program.runTests(Environment);
program.run(Environment);