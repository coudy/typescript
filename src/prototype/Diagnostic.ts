///<reference path='DiagnosticCode.ts' />

class Diagnostic {
    private _diagnosticCode: DiagnosticCode = 0;
    private _arguments: any[] = null;

    // Only the compiler creates instances.
    constructor(diagnosticCode: DiagnosticCode, arguments: any[]) {
        this._diagnosticCode = diagnosticCode;
        this._arguments = (arguments && arguments.length > 0) ? arguments : null;
    }

    /// <summary>
    /// The error code, as an integer.
    /// </summary>
    public diagnosticCode(): DiagnosticCode {
        return this._diagnosticCode;
    }

    /// <summary>
    /// If a derived class has additional information about other referenced symbols, it can
    /// expose the locations of those symbols in a general way, so they can be reported along
    /// with the error.
    /// </summary>
    public additionalLocations(): Location[] {
        return [];
    }

    /// <summary>
    /// Get the text of the message in the given language.
    /// </summary>
    public message(): string {
        return DiagnosticMessages.getDiagnosticMessage(this._diagnosticCode, this._arguments);
    }
}