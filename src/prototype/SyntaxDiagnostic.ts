///<reference path='Diagnostic.ts' />

class SyntaxDiagnostic extends Diagnostic {
    private _position: number;
    private _width: number;

    constructor(position: number, width: number, code: DiagnosticCode, args: any[]) {
        super(code, args);

        if (width < 0) {
            throw Errors.argumentOutOfRange("width");
        }

        this._position = position;
        this._width = width;
    }

    public toJSON(key) {
        var result: any = {};
        result._position = this._position;
        result._width = this._width;
        result._diagnosticCode = (<any>DiagnosticCode)._map[this.diagnosticCode()];

        var arguments = (<any>this)._arguments;
        if (arguments && arguments.length > 0) {
            result._arguments = arguments;
        }

        return result;
    }

    public position(): number {
        return this._position;
    }

    public width(): number {
        return this._width;
    }
}