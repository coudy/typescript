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

        private containsToken(list: ISyntaxList, kind: SyntaxKind): bool {
            for (var i = 0, n = list.childCount(); i < n; i++) {
                if (list.childAt(i).kind() === kind) {
                    return true;
                }
            }

            return false;
        }

        private pushDiagnostic(start: number, length: number, diagnosticCode: DiagnosticCode, args: any[] = null): void {
            this.diagnostics.push(new SyntaxDiagnostic(
                this.fileName, start, length, diagnosticCode, args));
        }

        private pushDiagnostic1(elementFullStart: number, element: ISyntaxElement, diagnosticCode: DiagnosticCode, args: any[] = null): void {
            this.diagnostics.push(new SyntaxDiagnostic(
                this.fileName, elementFullStart + element.leadingTriviaWidth(), element.width(), diagnosticCode, args));
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
                            this.pushDiagnostic1(
                                parameterFullStart, parameter,
                                DiagnosticCode.Rest_parameter_must_be_last_in_list);
                            break;
                        }
                    }
                    else if (parameter.questionToken || parameter.equalsValueClause) {
                        seenOptionalParameter = true;

                        if (parameter.questionToken && parameter.equalsValueClause) {
                            this.pushDiagnostic1(
                                parameterFullStart, parameter,
                                DiagnosticCode.Parameter_cannot_have_question_mark_and_initializer);
                            break;
                        }
                    }
                    else {
                        if (seenOptionalParameter) {
                            this.pushDiagnostic1(
                                parameterFullStart, parameter,
                                DiagnosticCode.Required_parameter_cannot_follow_optional_parameter);
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
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signatures_cannot_have_rest_parameters);
            }
            else if (parameter.publicOrPrivateKeyword) {
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signature_parameter_cannot_have_accessibility_modifierss);
            }
            else if (parameter.questionToken) {
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signature_parameter_cannot_have_a_question_mark);
            }
            else if (parameter.equalsValueClause) {
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signature_parameter_cannot_have_an_initializer);
            }
            else if (!parameter.typeAnnotation) {
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signature_parameter_must_have_a_type_annotation);
            }
            else if (parameter.typeAnnotation.type.kind() !== SyntaxKind.StringKeyword &&
                     parameter.typeAnnotation.type.kind() !== SyntaxKind.NumberKeyword) {
                this.pushDiagnostic1(
                    parameterFullStart, parameter,
                    DiagnosticCode.Index_signature_parameter_type_must_be__string__or__number_);
            }
            else if (!node.typeAnnotation) {
                this.pushDiagnostic1(
                    this.position(), node,
                    DiagnosticCode.Index_signature_must_have_a_type_annotation);
            }

            super.visitIndexSignature(node);
        }

        checkClassDeclarationHeritageClauses(node: ClassDeclarationSyntax): void {
            var heritageClausesFullStart = this.childFullStart(node, node.heritageClauses);
            var heritageClauseFullStart = heritageClausesFullStart;

            var seenExtendsClause = false;
            var seenImplementsClause = false;

            for (var i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                Debug.assert(i <= 2);
                var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);

                if (heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ExtendsKeyword) {
                    if (seenExtendsClause) {
                        this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                            DiagnosticCode._extends__clause_already_seen);
                        return;
                    }

                    if (seenImplementsClause) {
                        this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                            DiagnosticCode._extends__clause_must_precede__implements__clause);
                        return;
                    }

                    if (heritageClause.typeNames.nonSeparatorCount() > 1) {
                        this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                            DiagnosticCode.Class_can_only_extend_single_type);
                        return;
                    }

                    seenExtendsClause = true;
                }
                else {
                    Debug.assert(heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ImplementsKeyword);
                    if (seenImplementsClause) {
                        this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                            DiagnosticCode._implements__clause_already_seen);
                        return;
                    }

                    seenImplementsClause = true;
                }

                heritageClauseFullStart += heritageClause.fullWidth();
            }
        }

        visitClassDeclaration(node: ClassDeclarationSyntax): void {
            this.checkClassDeclarationHeritageClauses(node);

            super.visitClassDeclaration(node);
        }

        checkInterfaceDeclarationHeritageClauses(node: InterfaceDeclarationSyntax): void {
            var heritageClausesFullStart = this.childFullStart(node, node.heritageClauses);
            var heritageClauseFullStart = heritageClausesFullStart;

            var seenExtendsClause = false;

            for (var i = 0, n = node.heritageClauses.childCount(); i < n; i++) {
                Debug.assert(i <= 1);
                var heritageClause = <HeritageClauseSyntax>node.heritageClauses.childAt(i);

                if (heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ExtendsKeyword) {
                    if (seenExtendsClause) {
                        this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                            DiagnosticCode._extends__clause_already_seen);
                        return;
                    }

                    seenExtendsClause = true;
                }
                else {
                    Debug.assert(heritageClause.extendsOrImplementsKeyword.tokenKind === SyntaxKind.ImplementsKeyword);
                    this.pushDiagnostic1(heritageClauseFullStart, heritageClause,
                        DiagnosticCode.Interface_declaration_cannot_have__implements__clause);
                    return;
                }

                heritageClauseFullStart += heritageClause.fullWidth();
            }
        }

        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void {
            this.checkInterfaceDeclarationHeritageClauses(node);

            super.visitInterfaceDeclaration(node);
        }

        checkClassElementModifiers(list: ISyntaxList): void {
            var modifierFullStart = this.position();

            var seenAccessibilityModifier = false;
            var seenStaticModifier = false;

            for (var i = 0, n = list.childCount(); i < n; i++) {
                var modifier = <ISyntaxToken>list.childAt(i);
                if (modifier.tokenKind === SyntaxKind.PublicKeyword ||
                    modifier.tokenKind === SyntaxKind.PrivateKeyword) {

                    if (seenAccessibilityModifier) {
                        this.pushDiagnostic1(modifierFullStart, modifier,
                            DiagnosticCode.Accessibility_modifier_already_seen);
                        return;
                    }

                    if (seenStaticModifier) {
                        this.pushDiagnostic1(modifierFullStart, modifier,
                            DiagnosticCode.Accessibility_modifier_must_precede__static__modifier);
                        return;
                    }

                    seenAccessibilityModifier = true;
                }
                else if (modifier.tokenKind === SyntaxKind.StaticKeyword) {
                    if (seenStaticModifier) {
                        this.pushDiagnostic1(modifierFullStart, modifier,
                            DiagnosticCode._static__modifier_already_seen);
                        return;
                    }

                    seenStaticModifier = true;
                }
                else {
                    this.pushDiagnostic1(modifierFullStart, modifier,
                        DiagnosticCode._0__modifier_cannot_appear_on_a_class_element, [modifier.text()]);
                    return;
                }

                modifierFullStart += modifier.fullWidth();
            }
        }

        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void {
            this.checkClassElementModifiers(node.modifiers);

            super.visitMemberVariableDeclaration(node);
        }

        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void {
            this.checkClassElementModifiers(node.modifiers);

            super.visitMemberFunctionDeclaration(node);
        }

        visitGetMemberAccessorDeclaration(node: GetMemberAccessorDeclarationSyntax): void {
            this.checkClassElementModifiers(node.modifiers);

            super.visitGetMemberAccessorDeclaration(node);
        }

        visitSetMemberAccessorDeclaration(node: SetMemberAccessorDeclarationSyntax): void {
            this.checkClassElementModifiers(node.modifiers);

            super.visitSetMemberAccessorDeclaration(node);
        }

        checkEnumDeclarationElements(node: EnumDeclarationSyntax): void {
            var enumElementsFullStart = this.childFullStart(node, node.enumElements);
            var enumElementFullStart = enumElementsFullStart;
            var seenExplicitMember = false;
            for (var i = 0, n = node.enumElements.childCount(); i < n; i++) {
                var nodeOrToken = node.enumElements.childAt(i);
                if (i % 2 === 0) {
                    var enumElement = <EnumElementSyntax>nodeOrToken;

                    if (enumElement.equalsValueClause) {
                        seenExplicitMember = true;
                    }
                    else if (seenExplicitMember) {
                        this.pushDiagnostic1(enumElementFullStart, enumElement,
                            DiagnosticCode.Enum_element_must_have_initializer);
                        return;
                    }
                }

                enumElementFullStart += nodeOrToken.fullWidth();
            }
        }

        visitEnumDeclaration(node: EnumDeclarationSyntax): void {
            this.checkEnumDeclarationElements(node);
            
            super.visitEnumDeclaration(node);
        }

        visitInvocationExpression(node: InvocationExpressionSyntax): void {
            if (node.expression.kind() === SyntaxKind.SuperKeyword &&
                node.argumentList.typeArgumentList !== null) {
                this.pushDiagnostic1(this.position(), node,
                    DiagnosticCode._super__invocation_cannot_have_type_arguments);
            }

            super.visitInvocationExpression(node);
        }

        visitModuleDeclaration(node: ModuleDeclarationSyntax): void {
            if (this.isDeclaration) {
            }
            else {
                if (node.stringLiteral && !this.containsToken(node.modifiers, SyntaxKind.DeclareKeyword)) {
                    var stringLiteralFullStart = this.childFullStart(node, node.stringLiteral);
                    this.pushDiagnostic1(stringLiteralFullStart, node.stringLiteral,
                        DiagnosticCode.Modules_in_implementation_files_with_quoted_names_must_have_the__declare__modifier);
                    return;
                }
            }

            super.visitModuleDeclaration(node);
        }
    }
}