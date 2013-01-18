///<reference path='SyntaxNodes.generated.ts' />
///<reference path='SyntaxDiagnostic.ts' />

class SyntaxTree {
    private _sourceUnit: SourceUnitSyntax;
    private _diagnostics: SyntaxDiagnostic[];

    constructor(sourceUnit: SourceUnitSyntax,
                diagnostics: SyntaxDiagnostic[]) {
        this._sourceUnit = sourceUnit;
        this._diagnostics = diagnostics;
    }

    public toJSON(key) {
        var result: any = { };

        if (this._diagnostics.length > 0) {
            result._diagnostics = this._diagnostics;
        }

        result._sourceUnit = this._sourceUnit;
        return result;
    }

    public sourceUnit(): SourceUnitSyntax {
        return this._sourceUnit;
    }

    public diagnostics(): SyntaxDiagnostic[] {
        return this._diagnostics;
    }

    //public findToken(position: number): ISyntaxToken {
    //    if (position < 0 || position > this._sourceUnit.endOfFileToken().end()) {
    //        throw Errors.argumentOutOfRange("position");
    //    }

    //    return null;
    //}

    public structuralEquals(tree: SyntaxTree): bool {
        return ArrayUtilities.sequenceEquals(this.diagnostics(), tree.diagnostics(), SyntaxDiagnostic.equals) &&
            this.sourceUnit().structuralEquals(tree.sourceUnit());
    }
}