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
    private stringTable = TypeScript.Collections.createStringTable();
    private simpleText = TypeScript.TextFactory.createSimpleText(compilerString);
    private sourceText = new TypeScript.StringScriptSnapshot(compilerString);

    public compile() {
        var settings = new TypeScript.CompilationSettings();
        settings.usePull = true;

        this.compiler = new TypeScript.TypeScriptCompiler(new StringTextWriter(), new DiagnosticsLogger(), settings);

        this.compiler.addUnit(libString, "lib.d.ts", []);
        this.compiler.addUnit(compilerString, "compiler.ts", []);

        this.compiler.pullTypeCheck();
    }

    // use this to test "clean" re-typecheck speed
    public reTypeCheck() {
        this.compiler.pullTypeCheck(true, true);
    }

    public oldParse(): { script: TypeScript.Script; sourceText: TypeScript.IScriptSnapshot; } {
        var parser1 = new TypeScript.Parser();
        parser1.errorRecovery = true;
        return { script: parser1.parse(this.sourceText, "", 0), sourceText: this.sourceText };
    }

    public newParse(): TypeScript.SyntaxTree {
        return TypeScript.Parser1.parse(this.simpleText, TypeScript.LanguageVersion.EcmaScript5, this.stringTable);
    }

    public newIncrementalParse(tree: TypeScript.SyntaxTree): TypeScript.SyntaxTree {
        var width = 100;
        var span = new TypeScript.TextSpan(TypeScript.IntegerUtilities.integerDivide(compilerString.length - width, 2), width);
        var range = new TypeScript.TextChangeRange(span, width);
        return TypeScript.Parser1.incrementalParse(tree, range, this.simpleText, TypeScript.LanguageVersion.EcmaScript5, this.stringTable);
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