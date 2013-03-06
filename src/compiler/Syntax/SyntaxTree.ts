///<reference path='SyntaxNodes.generated.ts' />
///<reference path='SyntaxDiagnostic.ts' />
///<reference path='..\Text\LineMap.ts' />

class SyntaxTree {
    private _sourceUnit: SourceUnitSyntax;
    private _diagnostics: SyntaxDiagnostic[];
    private _lineMap: LineMap;

    constructor(sourceUnit: SourceUnitSyntax,
                diagnostics: SyntaxDiagnostic[],
                lineMap: LineMap) {
        this._sourceUnit = sourceUnit;
        this._diagnostics = diagnostics;
        this._lineMap = lineMap;
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

    public structuralEquals(tree: SyntaxTree): bool {
        return ArrayUtilities.sequenceEquals(this.diagnostics(), tree.diagnostics(), SyntaxDiagnostic.equals) &&
            this.sourceUnit().structuralEquals(tree.sourceUnit());
    }
}