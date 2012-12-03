///<reference path='References.ts' />

class SyntaxTree {
    private _sourceUnit: SourceUnitSyntax;
    private _skippedTokens: ISyntaxToken[];
    private _diagnostics: SyntaxDiagnostic[];

    constructor(sourceUnit: SourceUnitSyntax,
                skippedTokens: ISyntaxToken[],
                diagnostics: SyntaxDiagnostic[]) {
        this._sourceUnit = sourceUnit;
        this._skippedTokens = skippedTokens;
        this._diagnostics = diagnostics;
    }

    public toJSON(key) {
        var result: any = { };
        if (this._skippedTokens.length > 0) {
            result._skippedTokens = this._skippedTokens;
        }
        
        if (this._diagnostics.length > 0) {
            result._diagnostics = this._diagnostics;
        }

        result._sourceUnit = this._sourceUnit;
        return result;
    }

    public sourceUnit(): SourceUnitSyntax {
        return this._sourceUnit;
    }

    public skippedTokens(): ISyntaxToken[] {
        return this._skippedTokens;
    }

    public diagnostics(): SyntaxDiagnostic[] {
        return this._diagnostics;
    }
}