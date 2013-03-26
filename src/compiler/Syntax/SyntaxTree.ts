///<reference path='References.ts' />

module TypeScript {
    export class SyntaxTree {
        private _sourceUnit: SourceUnitSyntax;
        private _isDeclaration: bool;
        private _parserDiagnostics: SyntaxDiagnostic[];
        private _allDiagnostics: SyntaxDiagnostic[] = null;
        private _fileName: string;
        private _lineMap: LineMap;
        private _languageVersion: LanguageVersion;
        private _parseOptions: ParseOptions;

        constructor(sourceUnit: SourceUnitSyntax,
                    isDeclaration: bool,
                    diagnostics: SyntaxDiagnostic[],
                    fileName: string,
                    lineMap: LineMap,
                    languageVersion: LanguageVersion,
                    parseOtions: ParseOptions) {
            this._sourceUnit = sourceUnit;
            this._isDeclaration = isDeclaration;
            this._parserDiagnostics = diagnostics;
            this._fileName = fileName;
            this._lineMap = lineMap;
            this._languageVersion = languageVersion;
            this._parseOptions = parseOtions;
        }

        public toJSON(key) {
            var result: any = {};

            result.isDeclaration = this._isDeclaration;
            result.languageVersion = (<any>LanguageVersion)._map[this._languageVersion];
            result.parseOptions = this._parseOptions;

            if (this.diagnostics().length > 0) {
                result.diagnostics = this.diagnostics();
            }

            result.sourceUnit = this._sourceUnit;
            result.lineMap = this._lineMap;

            return result;
        }

        public sourceUnit(): SourceUnitSyntax {
            return this._sourceUnit;
        }

        public isDeclaration(): bool {
            return this._isDeclaration;
        }

        private computeDiagnostics(): SyntaxDiagnostic[]{
            if (this._parserDiagnostics.length > 0) {
                return this._parserDiagnostics;
            }

            // No parser reported diagnostics.  Check for any additional grammar diagnostics.
            var diagnostics: SyntaxDiagnostic[] = [];
            this.sourceUnit().accept(new GrammarCheckerWalker(this.fileName(), diagnostics, this.isDeclaration()));

            return diagnostics;
        }

        public diagnostics(): SyntaxDiagnostic[] {
            if (this._allDiagnostics === null) {
                this._allDiagnostics = this.computeDiagnostics();
            }

            return this._allDiagnostics;
        }

        public fileName(): string {
            return this._fileName;
        }

        public lineMap(): LineMap {
            return this._lineMap;
        }

        public languageVersion(): LanguageVersion {
            return this._languageVersion;
        }

        public parseOptions(): ParseOptions {
            return this._parseOptions;
        }

        public structuralEquals(tree: SyntaxTree): bool {
            return ArrayUtilities.sequenceEquals(this.diagnostics(), tree.diagnostics(), SyntaxDiagnostic.equals) &&
                this.sourceUnit().structuralEquals(tree.sourceUnit());
        }
    }

    class GrammarCheckerWalker extends PositionTrackingWalker {
        constructor(private fileName: string,
                    private diagnostics: IDiagnostic[],
                    private isDeclaration: bool) {
            super();
        }

        private childFullStart(parent: ISyntaxNode, child: ISyntaxElement): number {
            return this.position() + Syntax.childOffset(parent, child);
        }

        private childStart(parent: ISyntaxNode, child: ISyntaxElement): number {
            return this.childFullStart(parent, child) + child.leadingTriviaWidth();
        }

        private pushDiagnostic(start: number, length: number, diagnosticCode: DiagnosticCode, args: any[] = null): void {
            this.diagnostics.push(new SyntaxDiagnostic(
                this.fileName, start, length, diagnosticCode, args));
        }

        private visitCatchClause(node: CatchClauseSyntax): void {
            if (node.typeAnnotation) {
                this.pushDiagnostic(
                    this.childStart(node, node.typeAnnotation),
                    node.typeAnnotation.width(),
                    DiagnosticCode.A_catch_clause_variable_cannot_have_a_type_annotation);
            }

            super.visitCatchClause(node);
        }

        private visitParameterList(node: ParameterListSyntax): void {
            var parametersPosition = this.childFullStart(node, node.parameters);
            var parameterFullStart = parametersPosition;

            var seenOptionalParameter = false;
            var parameterCount = node.parameters.nonSeparatorCount();

            for (var i = 0, n = node.parameters.childCount(); i < n; i++) {
                var nodeOrToken = node.parameters.childAt(i);
                if (i % 2 === 0) {
                    var parameterIndex = i / 2;
                    var parameter = <ParameterSyntax>node.parameters.childAt(i);

                    if (parameter.dotDotDotToken) {
                        if (parameterIndex != (parameterCount - 1)) {
                            this.pushDiagnostic(
                                parameterFullStart + parameter.leadingTriviaWidth(),
                                parameter.width(),
                                DiagnosticCode.Rest_parameter_must_be_last_in_list, null);
                            break;
                        }
                    }
                    else if (parameter.questionToken || parameter.equalsValueClause) {
                        seenOptionalParameter = true;

                        if (parameter.questionToken && parameter.equalsValueClause) {
                            this.pushDiagnostic(
                                parameterFullStart + parameter.leadingTriviaWidth(),
                                parameter.width(),
                                DiagnosticCode.Parameter_cannot_have_question_mark_and_initializer, null);
                            break;
                        }
                    }
                    else {
                        if (seenOptionalParameter) {
                            this.pushDiagnostic(
                                parameterFullStart + parameter.leadingTriviaWidth(),
                                parameter.width(),
                                DiagnosticCode.Required_parameter_cannot_follow_optional_parameter, null);
                            break;
                        }
                    }
                }

                parameterFullStart += nodeOrToken.fullWidth();
            }
            
            super.visitParameterList(node);
        }

        private visitIndexSignature(node: IndexSignatureSyntax): void {
            var parameterFullStart = this.childFullStart(node, node.parameter);
            var parameter = node.parameter;

            if (parameter.dotDotDotToken) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signatures_cannot_have_rest_parameters, null);
            }
            else if (parameter.publicOrPrivateKeyword) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signature_parameter_cannot_have_accessibility_modifierss, null);
            }
            else if (parameter.questionToken) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signature_parameter_cannot_have_a_question_mark, null);
            }
            else if (parameter.equalsValueClause) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signature_parameter_cannot_have_an_initializer, null);
            }
            else if (!parameter.typeAnnotation) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signature_parameter_must_have_a_type_annotation, null);
            }
            else if (parameter.typeAnnotation.type.kind() !== SyntaxKind.StringKeyword &&
                     parameter.typeAnnotation.type.kind() !== SyntaxKind.NumberKeyword) {
                this.pushDiagnostic(
                    parameterFullStart + parameter.leadingTriviaWidth(),
                    parameter.width(),
                    DiagnosticCode.Index_signature_parameter_type_must_be__string__or__number_, null);
            }
            else if (!node.typeAnnotation) {
                this.pushDiagnostic(
                    this.position() + node.leadingTriviaWidth(),
                    node.width(),
                    DiagnosticCode.Index_signature_must_have_a_type_annotation, null);
            }

            super.visitIndexSignature(node);
        }
    }
}