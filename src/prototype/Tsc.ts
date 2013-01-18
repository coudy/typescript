///<reference path='References.ts' />

class Program {
    private environment: IEnvironment;

    constructor(environment: IEnvironment) {
        this.environment = environment;
    }

    public run(): void {
        if (this.environment.arguments.length !== 3) {
            this.environment.standardOut.WriteLine("Usage: tsc.exe --out <out_file> <in_file>");
            return;
        }

        var inputFile = this.environment.arguments[2];
        var outputFile = this.environment.arguments[1];

        var contents = this.environment.readFile(inputFile, 'utf-8');
        var parser = new Parser(new Scanner(new StringText(contents), LanguageVersion.EcmaScript5, new StringTable()));

        var syntaxTree = parser.parseSyntaxTree();
        var diagnostics = syntaxTree.diagnostics();

        if (diagnostics.length) {
            this.environment.standardOut.WriteLine("Error parsing: " + inputFile);
            this.environment.writeFile(outputFile, "", false);
        }
        else {
            this.environment.writeFile(outputFile, contents, true);
        }
    }
}

var program = new Program(Environment);
program.run();