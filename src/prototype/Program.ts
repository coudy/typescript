///<reference path='References.ts' />

class Program {
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
program.run(Environment);