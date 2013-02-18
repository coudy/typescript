///<reference path='..\..\..\src\compiler\typescript.ts'/>
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

// var libstring = ...
// var compiler = ...


class BatchCompiler {

	public compiler: TypeScript.TypeScriptCompiler;
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
    public reTypeCheck() { this.compiler.pullTypeCheck(true); }
}

var batch = new BatchCompiler();
batch.compile();