///<reference path='..\..\..\src\compiler\typescript.ts'/>
///<reference path='..\..\..\src\compiler\Syntax\Parser.ts'/>
///<reference path='.\quotedLib.ts'/>
///<reference path='.\quotedCompiler.ts'/>

class StringTextWriter implements ITextWriter {
    public buff = "";

    Write(s: string) {
        this.buff += s;
    }

    WriteLine(s: string) {
        this.buff += s + "\n";
    }

    Close() { }
}

class DiagnosticsLogger implements TypeScript.ILogger {

    public information(): bool { return false; }
    public debug(): bool { return false; }
    public warning(): bool { return false; }
    public error(): bool { return false; }
    public fatal(): bool { return false; }
    public log(s: string): void {
        console.log(s);
    }
}

class BatchCompiler {
    public compiler: TypeScript.TypeScriptCompiler;
    private stringTable = Collections.createStringTable();
    private simpleText = TextFactory.createSimpleText(compilerString);
    private sourceText = new TypeScript.StringSourceText(compilerString);

    public compile() {
        var settings = new TypeScript.CompilationSettings();
        settings.usePull = true;
        settings.useFidelity = true;

        this.compiler = new TypeScript.TypeScriptCompiler(new StringTextWriter(), new DiagnosticsLogger(), settings);

        this.compiler.addUnit(libString, "lib.d.ts", false, []);
        this.compiler.addUnit(compilerString, "compiler.ts", false, []);

        this.compiler.pullTypeCheck();
    }

    // use this to test "clean" re-typecheck speed
    public reTypeCheck() {
        this.compiler.pullTypeCheck(true);
    }

    public oldParse(): { script: TypeScript.Script; sourceText: TypeScript.ISourceText; } {
        var parser1 = new TypeScript.Parser();
        parser1.errorRecovery = true;
        return { script: parser1.parse(this.sourceText, "", 0), sourceText: this.sourceText };
    }

    private changeText(previous: { script: TypeScript.Script; sourceText: TypeScript.ISourceText; },
                       newMiddle: string): { script: TypeScript.Script; sourceText: TypeScript.ISourceText; } {
        var previousScript = previous.script;
        var searchText = "export interface IDiagnosticWriter {";

        var text = previous.sourceText.getText(0, previous.sourceText.getLength());
        var start = text.indexOf(searchText) + searchText.length;
        var end = text.indexOf("}", start);

        var newCompilerString = text.substr(0, start) + newMiddle + text.substr(end);
        var newSourceText = new TypeScript.StringSourceText(newCompilerString);

        var parser = new TypeScript.IncrementalParser(new TypeScript.NullLogger());

        var originalLength = end - start;
        var range = new TypeScript.ScriptEditRange(start, end, newMiddle.length - originalLength);
        var result = parser.attemptIncrementalUpdateUnit(previousScript, "", newSourceText, range);

        parser.mergeTrees(result);
        return { script: previousScript, sourceText: newSourceText };
    }

    private insertText(previous: { script: TypeScript.Script; sourceText: TypeScript.ISourceText; }): { script: TypeScript.Script; sourceText: TypeScript.ISourceText; } {
        var newMiddle = " Alert1(output: string): void; ";
        return this.changeText(previous, newMiddle);
    }

    private deleteText(previous: { script: TypeScript.Script; sourceText: TypeScript.ISourceText; }): { script: TypeScript.Script; sourceText: TypeScript.ISourceText; } {
        var newMiddle = " Alert1(output: string): void; ";
        return this.changeText(previous, newMiddle);
    }

    public oldIncrementalParse(previous: { script: TypeScript.Script; sourceText: TypeScript.ISourceText; }): { script: TypeScript.Script; sourceText: TypeScript.ISourceText; } {
        // Insert some text, and delete some text.
        previous = this.insertText(previous);
        return this.deleteText(previous);
    }

    public newParse(): SyntaxTree {
        return Parser1.parse(this.simpleText, LanguageVersion.EcmaScript5, this.stringTable);
    }

    public newIncrementalParse(tree: SyntaxTree): SyntaxTree {
        var width = 100;
        var span = new TextSpan(IntegerUtilities.integerDivide(compilerString.length - width, 2), width);
        var range = new TextChangeRange(span, width);
        return Parser1.incrementalParse(tree.sourceUnit(), [range], this.simpleText, LanguageVersion.EcmaScript5, this.stringTable);
    }

    /*
export interface IDiagnosticWriter {
            Alert(output: string): void;
        }
    */
}

var batch = new BatchCompiler();
batch.compile();

// for (var i = 0; i < 2; i++) {
//    var tree = batch.newParse();
//    TypeScript.SyntaxTreeToAstVisitor.visit(tree.sourceUnit(), "", 0);
// }