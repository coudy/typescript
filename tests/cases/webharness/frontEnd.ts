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
    private simpleText = TypeScript.SimpleText.fromString(compilerString);
    private libScriptSnapshot = TypeScript.ScriptSnapshot.fromString(libString);
    private compilerScriptSnapshot = TypeScript.ScriptSnapshot.fromString(compilerString);

    public compile() {
        var settings = new TypeScript.CompilationSettings();

        this.compiler = new TypeScript.TypeScriptCompiler(new StringTextWriter(), new DiagnosticsLogger(), settings);

        this.compiler.addSourceUnit("lib.d.ts", this.libScriptSnapshot, []);
        this.compiler.addSourceUnit("compiler.ts", this.compilerScriptSnapshot, []);

        this.compiler.pullTypeCheck();
    }

    // use this to test "clean" re-typecheck speed
    public reTypeCheck() {
        this.compiler.pullTypeCheck(true, true);
    }

    public newParse(): TypeScript.SyntaxTree {
        return TypeScript.Parser.parse("compiler.ts", this.simpleText, false, TypeScript.LanguageVersion.EcmaScript5);
    }

    public newIncrementalParse(tree: TypeScript.SyntaxTree): TypeScript.SyntaxTree {
        var width = 100;
        var span = new TypeScript.TextSpan(TypeScript.IntegerUtilities.integerDivide(compilerString.length - width, 2), width);
        var range = new TypeScript.TextChangeRange(span, width);
        return TypeScript.Parser.incrementalParse(tree, range, this.simpleText);
    }
}

var batch = new BatchCompiler();
batch.compile();

// for (var i = 0; i < 2; i++) {
//    var tree = batch.newParse();
//    TypeScript.SyntaxTreeToAstVisitor.visit(tree.sourceUnit(), "", 0);
// }