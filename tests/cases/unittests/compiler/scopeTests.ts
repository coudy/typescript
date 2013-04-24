///<reference path='..\..\..\..\src\compiler\typescript.ts' />
///<reference path='..\..\..\..\src\harness\harness.ts' />

describe('Compiling tests\\compiler\\scopeTests.ts', function() {
    it("Scope check inside a public method inside public method", function() {
        var code  = 'class C {';
            code += '   static s;'
            code += '   public a() {'
            code += '      s = 1;' // ERR
            code += '   }'
            code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.equal(result.errors.length, 2);
        });
    });
    
    it("Scope check inside a static method inside static method", function() {
        var code  = 'class C {';
            code += '   private v;'
            code += '   public p;'
            code += '   static s;'
            code += '   static b() {'
            code += '      v = 1;' // ERR
            code += '      C.s = 1;' // OK
            code += '      this.p = 1;'// ERR
            code += '   }'
            code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.arrayLengthIs(result.errors, 2);
            assert.compilerWarning(result, 1, 68, "error TS2095: Could not find symbol 'v'.");
        });
    });

    it("Scope check extended class", function() {
        var code  = 'class C { private v; public p; static s; }';
        code += 'class D extends C {';
        code += '  public p: number;'
        code += '  constructor() {';
        code += '   super();'
        code += '   this.v = 1;';
        code += '   this.p = 1;';
        code += '   C.s = 1;';
        code += '  }';
        code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.arrayLengthIs(result.errors, 0);
        });
    });

    it("Scope check extended class with errors", function () {
        var code = 'class C { private v; public p; static s; }';
        code += 'class D extends C {';
        code += '  public v: number;';
        code += '  public p: number;'
        code += '  constructor() {';
        code += '   super();'
        code += '   this.v = 1;';
        code += '   this.p = 1;';
        code += '   C.s = 1;';
        code += '  }';
        code += '}';
        Harness.Compiler.compileString(code, 'declarations', function (result) {
            assert.arrayLengthIs(result.errors, 1);
            assert.compilerWarning(result, 1, 49, "error TS2141: Class 'D' cannot extend class 'C':\r\n\tProperty 'v' defined as public in type 'D' is defined as private in type 'C'.");
        } );
    } );

    it("Scope check extended class inside public method", function() {
        var code  = 'class C { private v; public p; static s; }';
            code += 'class D extends C {'
            code += '   public c() {'
            code += '      v = 1;'
            code += '      this.p = 1;'
            code += '      s = 1;'
            code += '   }'
            code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.arrayLengthIs(result.errors, 4);
            assert.compilerWarning(result, 1, 83, "error TS2095: Could not find symbol 'v'.");
            assert.compilerWarning(result, 1, 112, "error TS2095: Could not find symbol 's'.");
        });
    });

    it("Scope check extended class inside public method", function() {
        var code  = 'class C { private v; public p; static s; }';
            code += 'class D extends C {'
            code += '   public c() {'
            code += '      v = 1;'
            code += '      this.p = 1;'
            code += '      s = 1;'
            code += '   }'
            code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.arrayLengthIs(result.errors, 4);
            assert.compilerWarning(result, 1, 83, "error TS2095: Could not find symbol 'v'.");
            assert.compilerWarning(result, 1, 112, "error TS2095: Could not find symbol 's'.");
        });
    });
    
    it("Scope check extended class inside static method", function() {
        var code  = 'class C { private v; public p; static s; }';
            code += 'class D extends C {'
            code += '   static c() {'
            code += '      v = 1;'
            code += '      this.p = 1;'
            code += '      s = 1;'
            code += '   }'
            code += '}';
        Harness.Compiler.compileString(code, 'declarations', function(result) {
            assert.arrayLengthIs(result.errors, 4);
            assert.compilerWarning(result, 1, 83, "error TS2095: Could not find symbol 'v'.");
            assert.compilerWarning(result, 1, 112, "error TS2095: Could not find symbol 's'.");
        });
    });
});