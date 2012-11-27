///<reference path='References.ts' />

class SyntaxDiagnosticInfo extends DiagnosticInfo {
    private _offset = 0;
    private _width = 0;

    constructor(offset: number, width: number, code: DiagnosticCode, ...args: any[]) {
        super(code, args);

        if (width < 0) {
            throw Errors.argumentOutOfRange("width");
        }

        this._offset = offset;
        this._width = width;
    }

    public static create(code: DiagnosticCode, ...args: any[]): SyntaxDiagnosticInfo {
        return new SyntaxDiagnosticInfo(0, 0, code, args);
    }
}