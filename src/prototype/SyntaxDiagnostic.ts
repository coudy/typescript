///<reference path='References.ts' />

class SyntaxDiagnostic extends Diagnostic {
    private _position: number;
    private _width: number;

    constructor(position: number, width: number, code: DiagnosticCode, ...args: any[]) {
        super(code, args);

        if (width < 0) {
            throw Errors.argumentOutOfRange("width");
        }

        this._position = position;
        this._width = width;
    }

    public static create(code: DiagnosticCode, ...args: any[]): SyntaxDiagnostic {
        return new SyntaxDiagnostic(0, 0, code, args);
    }

    public position(): number {
        return this._position;
    }

    public width(): number {
        return this._width;
    }
}